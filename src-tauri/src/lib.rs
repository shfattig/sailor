// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use taskchampion::chrono::Utc;
use taskchampion::storage::AccessMode;
use taskchampion::{Operations, Replica, Status, StorageConfig, Uuid};

use std::cell::RefCell;

// Define a thread-local Replica instance
thread_local! {
    static REPLICA: RefCell<Option<Replica>> = RefCell::new(None);
}

// Function to get or initialize the replica in the current thread
fn with_replica<F, R>(f: F) -> Result<R, String>
where
    F: FnOnce(&mut Replica) -> Result<R, String>,
{
    REPLICA.with(|replica_cell| {
        let mut replica_ref = replica_cell.borrow_mut();

        if replica_ref.is_none() {
            // Initialize the replica if it hasn't been initialized yet
            let taskdb_dir = PathBuf::from(".tasks");
            let storage = StorageConfig::OnDisk {
                taskdb_dir,
                create_if_missing: true,
                access_mode: AccessMode::ReadWrite,
            }
            .into_storage()
            .expect("Failed to initialize storage");

            *replica_ref = Some(Replica::new(storage));
        }

        f(replica_ref.as_mut().unwrap())
    })
}

#[derive(Serialize, Deserialize, Debug)]
struct Task {
    id: String,
    description: String,
    due_date: Option<String>,
    done: bool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn create_task(description: &str) -> Result<String, String> {
    with_replica(|replica| {
        let uuid = Uuid::new_v4();
        let mut ops = Operations::new();

        let mut t = replica
            .create_task(uuid, &mut ops)
            .map_err(|e| e.to_string())?;
        t.set_description(description.into(), &mut ops)
            .map_err(|e| e.to_string())?;
        t.set_status(Status::Pending, &mut ops)
            .map_err(|e| e.to_string())?;
        t.set_entry(Some(Utc::now()), &mut ops)
            .map_err(|e| e.to_string())?;

        replica.commit_operations(ops).map_err(|e| e.to_string())?;

        Ok(uuid.to_string())
    })
}

#[tauri::command]
fn get_all_tasks() -> Result<Vec<Task>, String> {
    with_replica(|replica| {
        let task_uuids = replica.all_task_uuids().map_err(|e| e.to_string())?;
        let tasks = task_uuids
            .into_iter()
            .filter_map(|uuid| {
                replica.get_task(uuid).ok().map(|task| Task {
                    id: uuid.to_string(),
                    description: task.as_ref().unwrap().get_description().to_string(),
                    due_date: task.as_ref().unwrap().get_due().map(|d| d.to_rfc3339()),
                    done: task.as_ref().unwrap().get_status() == Status::Completed,
                })
            })
            .collect();
        Ok(tasks)
    })
}

#[tauri::command]
fn toggle_task(task_id: &str) -> Result<(), String> {
    with_replica(|replica| {
        let uuid = Uuid::parse_str(task_id).map_err(|e| e.to_string())?;
        let mut ops = Operations::new();

        let task = replica.get_task(uuid).map_err(|e| e.to_string())?;
        let mut task = task.unwrap();
        
        let new_status = if task.get_status() == Status::Completed {
            Status::Pending
        } else {
            Status::Completed
        };
        
        task.set_status(new_status, &mut ops).map_err(|e| e.to_string())?;
        replica.commit_operations(ops).map_err(|e| e.to_string())?;
        
        Ok(())
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_all_tasks, create_task, toggle_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

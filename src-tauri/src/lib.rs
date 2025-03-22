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
    content: String,
    due_date: Option<String>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_all_tasks() -> Result<Vec<String>, String> {
    with_replica(|replica| {
        let uuid = Uuid::new_v4();
        let mut ops = Operations::new();
        let mut t = replica
            .create_task(uuid, &mut ops)
            .map_err(|e| e.to_string())?;
        t.set_description("my first task".into(), &mut ops)
            .map_err(|e| e.to_string())?;
        t.set_status(Status::Pending, &mut ops)
            .map_err(|e| e.to_string())?;
        t.set_entry(Some(Utc::now()), &mut ops)
            .map_err(|e| e.to_string())?;

        replica.commit_operations(ops).map_err(|e| e.to_string())?;
        println!("Task created!");

        // // Set up a local, on-disk server.
        // let server_config = ServerConfig::Local { server_dir };
        // let mut server = server_config.into_server()?;

        // // Sync to that server.
        // replica.sync(&mut server, true)?;

        // vec![
        //     Task {
        //         id: "1".to_string(),
        //         content: "Task 1".to_string(),
        //         due_date: Some("2025-10-04".to_string()),
        //     },
        //     Task {
        //         id: "2".to_string(),
        //         content: "Task 2".to_string(),
        //         due_date: Some("2025-10-05".to_string()),
        //     },
        // ]

        let task_uuids = replica.all_task_uuids().map_err(|e| e.to_string())?;

        Ok(task_uuids
            .into_iter()
            .map(|uuid| uuid.to_string())
            .collect())
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_all_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

<script lang="ts">
  import {
    TreeViewPlugin,
    Composer,
    ContentEditable,
    ToolbarRichText,
    ActionBar,
    RichTextPlugin,
    HistoryPlugin,
    ListPlugin,
    CheckListPlugin,
    HorizontalRulePlugin,
    ImagePlugin,
    MarkdownShortcutPlugin,
    ALL_TRANSFORMERS,
    KeywordNode,
    HashtagNode,
    AutoLinkNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    LayoutContainerNode,
    LayoutItemNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    HorizontalRuleNode,
    ImageNode,
    $getRoot as getRoot,
    $createTextNode as createTextNode,
    $createParagraphNode as createParagraphNode,
    $createListNode as createListNode,
    getEditor,
    type LexicalEditor,

    UNORDERED_LIST

  } from 'svelte-lexical';
  import {
    $createHeadingNode as createHeadingNode,
  } from '@lexical/rich-text';
  import {
    TextNode,
  } from 'lexical';
  import {theme} from 'svelte-lexical/dist/themes/default';
  import {headingTransformer, heading_mut_listener, heading_transform_listener} from '../../transformers/headingTransformer';
  import { onMount } from 'svelte';
  import { taskTransformer } from './custom_transformers/taskTransformer';
  import { TaskListItemNode, $createTaskListItemNode as createTaskListItemNode } from './custom_transformers/taskItemNode';
  import { invoke } from '@tauri-apps/api/core';
  import type { ListType } from '@lexical/list';
    import { DateNode } from './custom_transformers/DateNode';

  interface Task {
    id: string;
  }

  let editorInstance: { getEditor: () => LexicalEditor };

  onMount(() => {
      // Ensure editor is initialized
      if (editorInstance) {
        const editor = editorInstance.getEditor();
        editor.registerMutationListener(HeadingNode, heading_mut_listener);
        editor.registerNodeTransform(TextNode, heading_transform_listener);
        editor.registerUpdateListener(({ editorState }) => {
          console.log("Editor State:", editorState._nodeMap);
        });
      }
    });

  const tasks = invoke('get_all_tasks');
  console.log('tasks', tasks);

  const initialConfig = {
    theme: theme,
    namespace: 'RichTextComposer',
    nodes: [
      TaskListItemNode,
      DateNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      HorizontalRuleNode,
      ImageNode,
      KeywordNode,
      HashtagNode,
      AutoLinkNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      LayoutContainerNode,
      LayoutItemNode,
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
    onError: (error: Error) => {
      throw error;
    },
    editorState: () => {
      const root = getRoot();
      if (root.getFirstChild() === null) {

        // const paragraph = createParagraphNode();
        // paragraph.append(
        //   createTextNode('This demo environment is built with '),
        //   createTextNode('svelte-lexical').toggleFormat('code'),
        //   createTextNode('.'),
        //   createTextNode(' Try typing in '),
        //   createTextNode('some text').toggleFormat('bold'),
        //   createTextNode(' with '),
        //   createTextNode('different').toggleFormat('italic'),
        //   createTextNode(' formats.'),
        // );
        // root.append(paragraph);
      }
    },
  };
  export const MY_TRANSFORMERS = [
    headingTransformer,
    taskTransformer,
    // UNORDERED_LIST,
    // ... ALL_TRANSFORMERS
  ]
</script>

<Composer bind:this={editorInstance} {initialConfig}>
  <div class="editor-shell svelte-lexical">
    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
        </div>
      </div>
      <MarkdownShortcutPlugin transformers={MY_TRANSFORMERS} />
      <RichTextPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <ImagePlugin />
      <TreeViewPlugin />
    </div>
  </div>
</Composer>

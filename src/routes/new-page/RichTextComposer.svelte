<script lang="ts">
  import {
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
    getEditor,
    type LexicalEditor
  } from 'svelte-lexical';
  import {
    $createHeadingNode as createHeadingNode,
  } from '@lexical/rich-text';
  import {
    TextNode,
  } from 'lexical';
  import {theme} from 'svelte-lexical/dist/themes/default';
  import {headingTransformer, heading_mut_listener, heading_transform_listener} from './custom_transformers/headingTransformer';
  import { onMount } from 'svelte';
  import { taskTransformer } from './custom_transformers/taskTransformer';
  import { TaskListItemNode } from './custom_transformers/taskItemNode';
    import { invoke } from '@tauri-apps/api/core';

  let editorInstance: { getEditor: () => LexicalEditor };

  onMount(() => {
      // Ensure editor is initialized
      if (editorInstance) {
        const editor = editorInstance.getEditor();
        editor.registerMutationListener(HeadingNode, heading_mut_listener);
        editor.registerNodeTransform(TextNode, heading_transform_listener);
        editor.registerUpdateListener(({ editorState }) => {
          console.log('Editor State:', editorState);
          // console.log('Editor Debug:', editorState._debug());
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
    onError: (error) => {
      throw error;
    },
    editorState: () => {
      const root = getRoot();
      if (root.getFirstChild() === null) {
        const paragraph = createParagraphNode();
        paragraph.append(
          createTextNode('This demo environment is built with '),
          createTextNode('svelte-lexical').toggleFormat('code'),
          createTextNode('.'),
          createTextNode(' Try typing in '),
          createTextNode('some text').toggleFormat('bold'),
          createTextNode(' with '),
          createTextNode('different').toggleFormat('italic'),
          createTextNode(' formats.'),
        );
        root.append(paragraph);
      }
    },
  };
  export const MY_TRANSFORMERS = [
    headingTransformer,
    taskTransformer,
    // ... ALL_TRANSFORMERS
  ]
</script>

<Composer bind:this={editorInstance} {initialConfig}>
  <div class="editor-shell svelte-lexical">
    <ToolbarRichText />
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

      <ActionBar />
    </div>
  </div>
</Composer>

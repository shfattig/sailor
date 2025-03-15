<script>
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
    TableRowNode
  } from 'svelte-lexical';
  import {
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    HorizontalRuleNode,
    ImageNode,
  } from 'svelte-lexical';
  import {theme} from 'svelte-lexical/dist/themes/default';
  import {
    $getRoot as getRoot,
    $createTextNode as createTextNode,
    $createParagraphNode as createParagraphNode,
  } from 'svelte-lexical';
  import {headingTransformer} from './custom_transformers/headingTransformer';

  const initialConfig = {
    theme: theme,
    nodes: [
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
    // ... ALL_TRANSFORMERS
  ]
</script>

<Composer {initialConfig}>
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

import React from "react";

export const RichTextEditor = ({text, style, onChange}:{onChange:(ev:React.ChangeEvent<HTMLTextAreaElement>)=>void, style:React.CSSProperties, text:string}) => {
    return <textarea style={{...style, padding: 10}} defaultValue={text} onChange={onChange}/>
    
    // return <Box contentEditable sx={{...style}} padding={1} border={'solid 2px lightgray'} borderRadius={8} onInput={onChange}>
    //     {text}
    // </Box>
}

/*
Creating a rich text editor from scratch in React would be a complex undertaking, but here's an overview of what would be involved:

## Core Components

1. **Editable Content Area**: Use a `contenteditable` div as the main editing surface[4].

2. **Toolbar**: Create a toolbar with buttons for formatting options like bold, italic, underline, lists, etc[4].

3. **Selection Handling**: Implement logic to track and manipulate text selection[4].

## Key Functionality 

1. **Text Formatting**: 
   - Use `document.execCommand()` for basic formatting like bold, italic, underline[4].
   - Handle more complex formatting by manipulating the DOM directly.

2. **Paragraph Styling**: 
   - Implement functions to create headings, lists, blockquotes, etc.

3. **Link Handling**:
   - Create UI for inserting/editing links.
   - Implement link detection and rendering.

4. **Image Insertion**:
   - Allow image uploads or URL insertion.
   - Handle image resizing and alignment.

5. **Undo/Redo**:
   - Implement a history stack to track changes.

6. **Copy/Paste Handling**:
   - Clean up pasted content to match your editor's format.

7. **Keyboard Shortcuts**:
   - Implement common shortcuts for formatting and actions.

## State Management

1. Use React state to store the editor's content[1].
2. Implement functions to update the state based on user actions[1].

## Challenges

1. **Cross-browser Compatibility**: Ensure consistent behavior across different browsers.
2. **Performance**: Optimize for large documents and frequent updates.
3. **Accessibility**: Ensure the editor is usable with screen readers and keyboard navigation.

## Example Implementation

Here's a basic structure to get started:

```jsx
import React, { useState, useRef } from 'react';

function RichTextEditor() {
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  const handleBold = () => {
    document.execCommand('bold', false, null);
  };

  const handleItalic = () => {
    document.execCommand('italic', false, null);
  };

  const handleContentChange = () => {
    setContent(editorRef.current.innerHTML);
  };

  return (
    <div>
      <div>
        <button onClick={handleBold}>Bold</button>
        <button onClick={handleItalic}>Italic</button>
      </div>
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default RichTextEditor;
```

This is a very basic implementation and would need significant expansion to create a fully-featured rich text editor[1][4].

## Considerations

Building a rich text editor from scratch is a significant undertaking. Many developers opt to use existing libraries like Draft.js, Quill, or CKEditor, which provide robust, well-tested solutions[1][2][3]. These libraries often offer more features and better cross-browser compatibility than a custom implementation.

If you decide to build your own, be prepared for a complex project that will require ongoing maintenance and updates to keep up with browser changes and user expectations.

Citations:
[1] https://blog.logrocket.com/build-rich-text-editors-react-draft-js-react-draft-wysiwyg/
[2] https://ej2.syncfusion.com/react/documentation/rich-text-editor/getting-started
[3] https://www.youtube.com/watch?v=kykC7i9VUE4
[4] https://www.reddit.com/r/reactjs/comments/1905utu/creating_a_rich_text_editor_in_react_no_packages/
[5] https://stackoverflow.com/questions/70242100/using-rich-text-editor-in-a-react-application
[6] https://www.tiny.cloud/blog/react-rich-text-editor/
[7] https://www.honeybadger.io/blog/build-rich-text-editor-for-your-react-app/
[8] https://www.smashingmagazine.com/2021/05/building-wysiwyg-editor-javascript-slatejs/
*/
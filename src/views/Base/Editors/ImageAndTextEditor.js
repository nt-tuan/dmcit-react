import React, { useState, useMemo } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import InsertImages from 'slate-drop-or-paste-images/dist/slate-drop-or-paste-images'
import { Transforms, createEditor } from 'slate'
import {
    Slate,
    Editable,
    useEditor,
    useSelected,
    useFocused,
    withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { css } from 'emotion'

import { Button, Icon, Toolbar } from './components'

const plugins = [
    InsertImages({
      extensions: ['png'],
      insertImage: (change, file) => {
        return change.insertBlock({
          type: 'image',
          isVoid: true,
          data: { file }
        })
      }
    })
  ]

const ImagesExample = ({ onChange }) => {
    const [value, setValue] = useState(initialValue)
    const editor = useMemo(
        () => withImages(withHistory(withReact(createEditor()))),
        []
    )

    const handleChange = (value) => {
        setValue(value);
        onChange && onChange(value);
    }

    return (
        <Slate editor={editor} value={value} onChange={handleChange}>
            <Toolbar>
                <InsertImageButton />
            </Toolbar>
            <Editable
                renderElement={props => <Element {...props} />}
                placeholder="Enter some text..."
                style={{backgroundColor: '#ddd', border: "2px solid #efefef", padding: "10px 1px"}}
                plugins={plugins}
            />
        </Slate>
    )
}

const withImages = editor => {
    const { insertData, isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result
                        insertImage(editor, url)
                    })

                    reader.readAsDataURL(file)
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

const insertImage = (editor, url) => {
    const text = { text: '' }
    const image = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
}

const Element = props => {
    const { attributes, children, element } = props

    switch (element.type) {
        case 'image':
            return <ImageElement {...props} />
        default:
            return <p {...attributes}>{children}</p>
    }
}

const ImageElement = ({ attributes, children, element }) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            <div contentEditable={false}>
                <img
                    src={element.url}
                    className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
                />
            </div>
            {children}
        </div>
    )
}

const InsertImageButton = () => {
    const editor = useEditor()
    return (
        <Button
            onMouseDown={event => {
                event.preventDefault()
                const url = window.prompt('Enter the URL of the image:')
                if (!url) return
                insertImage(editor, url)
            }}
        >
            <Icon>image</Icon>
        </Button>
    )
}

const isImageUrl = url => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            {
                text:
                    '',
            },
        ],
    }
]

export default ImagesExample
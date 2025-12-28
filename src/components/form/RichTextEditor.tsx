'use client';

import type QuillType from "quill";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import 'quill/dist/quill.snow.css';

type RichTextEditorProps = {
    defaultValue?: string;
};

export type RichTextEditorHandle = {
    setContent: (content: string) => void;
    getContent: () => string;
};

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({ defaultValue }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<QuillType | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadQuill = async () => {
            if (editorRef.current && !quillRef.current) {
                const { default: Quill } = await import('quill');

                if (!isMounted) {
                    return;
                }

                editorRef.current.innerHTML = '';

                quillRef.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    modules: {
                        toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link', 'image'],
                            ['clean'],
                        ],
                    },
                    placeholder: 'Deine Beschreibung ...',
                });

                if (defaultValue) {
                    quillRef.current.clipboard.dangerouslyPasteHTML(0, defaultValue);
                }
            }
        };

        loadQuill();

        return () => {
            isMounted = false;
            quillRef.current = null;
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
        };
    }, []);

    useImperativeHandle(ref, () => ({
        getContent: () => {
            if (quillRef.current) {
                return quillRef.current.root.innerHTML;
            }
            return '';
        },
        setContent: (content: string) => {
            if (quillRef.current) {
                quillRef.current.setText('');

                quillRef.current.clipboard.dangerouslyPasteHTML(0, content);
            }
        },
    }));

    return <div
        ref={editorRef}
        style={{ height: '150px' }}
        className={"dark:text-white/90"}
    />;
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
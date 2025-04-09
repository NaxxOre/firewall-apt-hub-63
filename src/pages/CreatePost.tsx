import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Editor } from "@monaco-editor/react";

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost } = useStore();
  const { postId } = useParams<{ postId?: string }>();
  const [imageDataUrls, setImageDataUrls] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>(['']);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    isPublic: Yup.boolean(),
    codeSnippet: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      isPublic: true,
      codeSnippet: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const filteredLinks = links.filter(link => link.trim() !== '');

      addPost({
        title: values.title,
        content: values.content,
        isPublic: values.isPublic,
        imageUrls: imageDataUrls.length > 0 ? imageDataUrls : undefined,
        codeSnippet: values.codeSnippet || undefined,
        externalLinks: filteredLinks.length > 0 ? filteredLinks : undefined,
        ...(postId ? { parentId: postId } : {}),
      });
      
      toast.success('Post created successfully!');
      navigate('/forum');
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.map((file: File) => {
      const reader = new FileReader();
      
      reader.onload = function(e: any) {
        setImageDataUrls((prevState) => [...prevState, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  const removeImage = (index: number) => {
    const newImageDataUrls = [...imageDataUrls];
    newImageDataUrls.splice(index, 1);
    setImageDataUrls(newImageDataUrls);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-2xl bg-card p-6 rounded-lg border border-border shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create a Forum Post</h1>
          <p className="text-muted-foreground mt-2">Share your knowledge with the community</p>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...formik.getFieldProps('title')}
              className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter post title"
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            ) : null}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              {...formik.getFieldProps('content')}
              rows={5}
              className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Write your post content here"
            />
            {formik.touched.content && formik.errors.content ? (
              <div className="text-red-500 text-sm">{formik.errors.content}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="codeSnippet" className="text-sm font-medium">
              Code Snippet
            </label>
            <Editor
              height="200px"
              defaultLanguage="javascript"
              value={formik.values.codeSnippet}
              onChange={(value) => formik.setFieldValue('codeSnippet', value)}
              theme="vs-dark"
              options={{
                "acceptSuggestionOnEnter": "off",
                "wordBasedSuggestions": false,
                "suggestOnTriggerCharacters": false,
                "tabCompletion": "off"
              }}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Images
            </label>
            <div {...getRootProps()} className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop some files here, or click to select files</p>
              }
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {imageDataUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Uploaded ${index}`} className="w-32 h-32 object-cover rounded-md" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              External Links
            </label>
            {links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter URL"
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLink}
              className="bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Link
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="isPublic"
              type="checkbox"
              {...formik.getFieldProps('isPublic')}
              className="h-5 w-5 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Make this post public
            </label>
          </div>
          
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-primary py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

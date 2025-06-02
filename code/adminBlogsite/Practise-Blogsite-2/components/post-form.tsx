"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"
import { generateSlug } from "@/lib/utils"
import type { Database } from "@/lib/database.types"

type Post = Database["public"]["Tables"]["posts"]["Row"]

interface PostFormProps {
  post?: Post
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [content, setContent] = useState(post?.content || "")
  const [published, setPublished] = useState(post?.published || false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(generateSlug(title))
    }
  }, [title, slugEdited])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!title || !slug || !content) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      let imageUrl = post?.image_url || null;
      // Only upload if a new file is selected
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(`public/${Date.now()}-${imageFile.name}`, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
      if (post) {
        // Update existing post
        const { error } = await supabase
          .from("posts")
          .update({
            title,
            slug,
            content,
            published,
            image_url: imageUrl,
          })
          .eq("id", post.id)
        if (error) throw error
      } else {
        // Create new post
        let baseSlug = generateSlug(title)
        let uniqueSlug = baseSlug
        let counter = 1
        // Check for existing slug and auto-increment if needed
        while (true) {
          const { data: existing, error: checkError } = await supabase
            .from("posts")
            .select("id")
            .eq("slug", uniqueSlug)
            .maybeSingle()
          if (checkError) throw checkError
          if (!existing) break
          uniqueSlug = `${baseSlug}-${counter++}`
        }
        const { error } = await supabase.from("posts").insert({
          title,
          slug: uniqueSlug,
          content,
          published,
          image_url: imageUrl,
        })
        if (error) throw error
      }

      router.push("/admin/posts")
      router.refresh()
    } catch (err: any) {
      console.error("Error saving post:", err)
      setError(err.message || "Failed to save post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-md bg-red-500/20 p-4 text-sm text-white">{error}</div>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-white/10 bg-white/5"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugEdited(true)
            }}
            className="border-white/10 bg-white/5"
            required
          />
          <p className="text-xs text-white/60">This will be used in the URL: /blog/{slug || "your-post-slug"}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border-white/10 bg-white/5"
          />
          {post?.image_url && (
            <img src={post.image_url} alt="Post image" className="mt-2 max-h-48 rounded" />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] border-white/10 bg-white/5"
            required
          />
          <p className="text-xs text-white/60">
            You can use HTML for formatting. Basic tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;,
            &lt;ul&gt;, &lt;li&gt;, and &lt;a&gt; are supported.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Publish this post</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts")}
          className="border-white/10 bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-800 hover:from-emerald-400 hover:to-sky-500"
        >
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}

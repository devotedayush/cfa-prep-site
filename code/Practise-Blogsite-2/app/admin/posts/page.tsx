"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Edit, Eye, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"
import { formatDate } from "@/lib/utils"

type Post = Database["public"]["Tables"]["posts"]["Row"]

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam  {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterParam === 'drafts' ? 'draft' : 'all');
  
  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);
  
  async function fetchPosts() {
    setLoading(true);
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (statusFilter === 'published') {
      query = query.eq('published', true);
    } else if (statusFilter === 'draft') {
      query = query.eq('published', false);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    
    setLoading(false);
  }
  
  async function deletePost(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } else {
      fetchPosts();
    }
  }
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="mt-2 text-white/60">Manage your blog posts</p>
        </div>
        <Link href="/admin/posts/new" className="mt-4 sm:mt-0">
          <Button className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-800 hover:from-emerald-400 hover:to-sky-500">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-white/10 bg-white/5"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px] border-white/10 bg-white/5">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/60">Loading posts...</div>
        ) : filteredPosts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="w-[50%]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.published 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-white/10 bg-white/5"
                        onClick={() => router.push(`/admin/posts/${post.id}`)}
                      >
                        <span className="sr-only">Edit</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {post.published && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-white/10 bg-white/5"
                          asChild
                        >
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <span className="sr-only">View</span>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-white/10 bg-white/5 hover:bg-red-500/20 hover:text-red-300"
                        onClick={() => deletePost(post.id)}
                      >
                        <span className="sr-only">Delete</span>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-white/60">
            {searchQuery ? 'No posts match your search' : 'No posts found'}
          </div>
        )}
      </div>
    </div>
  );
}

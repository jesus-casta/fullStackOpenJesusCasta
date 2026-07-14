import { create } from 'zustand'
import blogService from '../services/blogs'

const sortBlogs = (blogs) => {
  return [...blogs].sort((first, second) => second.likes - first.likes)
}

const useBlogStore = create((set) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs: sortBlogs(blogs) })
  },

  createBlog: async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)

    set((state) => ({
      blogs: sortBlogs(state.blogs.concat(createdBlog)),
    }))

    return createdBlog
  },

  updateBlog: async (blog) => {
    const updatedBlog = await blogService.update(blog.id, blog)

    set((state) => ({
      blogs: sortBlogs(
        state.blogs.map((currentBlog) =>
          currentBlog.id === updatedBlog.id ? updatedBlog : currentBlog
        )
      ),
    }))

    return updatedBlog
  },

  removeBlog: async (blog) => {
    await blogService.remove(blog.id)

    set((state) => ({
      blogs: state.blogs.filter((currentBlog) => currentBlog.id !== blog.id),
    }))
  },

  addComment: async (blog, comment) => {
    const updatedBlog = await blogService.addComment(blog.id, comment)

    set((state) => ({
      blogs: sortBlogs(
        state.blogs.map((currentBlog) =>
          currentBlog.id === updatedBlog.id ? updatedBlog : currentBlog
        )
      ),
    }))

    return updatedBlog
  },
}))

export default useBlogStore

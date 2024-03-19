-- DropForeignKey
ALTER TABLE "CommentsOnBlogs" DROP CONSTRAINT "CommentsOnBlogs_blogId_fkey";

-- DropForeignKey
ALTER TABLE "CommentsOnBlogs" DROP CONSTRAINT "CommentsOnBlogs_commentId_fkey";

-- AddForeignKey
ALTER TABLE "CommentsOnBlogs" ADD CONSTRAINT "CommentsOnBlogs_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsOnBlogs" ADD CONSTRAINT "CommentsOnBlogs_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

class PostsController < ApplicationController
  def index
    @page = params[:page] || 1
    @posts = Post.page @page
  end
end

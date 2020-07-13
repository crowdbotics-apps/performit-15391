from django.contrib import admin

# Register your models here.
from posts.models import Post, PostRank, PostComment, PostView


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['user', 'content', 'caption','thumbnail', 'created_at', 'updated_at']


@admin.register(PostRank)
class PostRankAdmin(admin.ModelAdmin):
    exclude = ("average_rank ",)
    readonly_fields = ('average_rank',)
    list_display = ['ranker', 'post', 'rank', 'average_rank', 'created_at', 'updated_at']


@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ['commenter', 'comment', 'post', 'created_at', 'updated_at']


@admin.register(PostView)
class PostViewAdmin(admin.ModelAdmin):
    list_display = ['viewer', 'post', 'created_at', 'updated_at']

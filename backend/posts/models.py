from django.core.validators import RegexValidator
from django.db import models
from django.conf import settings
from django.db.models import Sum


# Create your models here.
from django.db.models.signals import pre_delete
from django.dispatch import receiver


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_user_set")
    content = models.FileField("SELECT Media", null=False, upload_to="posts/")
    thumbnail = models.ImageField("SELECT Thumbnail", null=True, blank=True, upload_to="posts/")
    caption = models.TextField("Enter Caption for post", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.user, self.content, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'User Post Management'
        verbose_name_plural = 'User Post Management'


class PostRank(models.Model):
    rank_regex = RegexValidator(regex=r'^[1-5]$',
                                 message="Please choose 1-5")
    ranker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_rank_ranker")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_rank_post")
    rank = models.IntegerField("Enter Rank", null=False, validators=[rank_regex])
    average_rank = models.DecimalField("Enter Average Rank", max_digits=7, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.ranker, self.post, self.rank,
                                self.average_rank, self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Post Rank Management'
        verbose_name_plural = 'Post Rank Management'

    def save(self,  *args, **kwargs):
        existing_qs = PostRank.objects.filter(post=self.post.id)
        existing_count = existing_qs.count()
        existing_sum = existing_qs.aggregate(Sum('rank'))['rank__sum']
        if existing_sum is None:
            existing_sum = 0
        new_sum = existing_sum + self.rank
        new_count = existing_count + 1
        average = new_sum / new_count
        if self.pk is None:
            self.average_rank = average
        super(PostRank, self).save(*args, **kwargs)


class PostComment(models.Model):
    commenter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_commenter_set")
    comment = models.TextField("Enter Comment", null=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comment_post_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.commenter, self.comment, self.post,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Post Comment Management'
        verbose_name_plural = 'Post Comment Management'


class PostView(models.Model):
    viewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_view_viewer_set")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_view_post_set")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __set__(self):
        return "{} - {}".format(self.viewer, self.post,
                                self.created_at, self.updated_at)

    class Meta:
        verbose_name = 'Post Views Management'
        verbose_name_plural = 'Post Views Management'

@receiver(pre_delete, sender=Post)
def post_delete(sender, instance, **kwargs):
    # Pass false so FileField doesn't save the model.
    instance.content.delete(False)


class Attachment < ActiveRecord::Base
	belongs_to :task
	mount_uploader :file, MediaUploader
end

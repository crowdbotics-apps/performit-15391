class PostFunctions:
    @staticmethod
    def valid_extension(extension):
        if extension == 'mp4' or extension == 'x-m4v' or extension == 'x-matroska' or \
                extension == 'webm' or extension == 'quicktime' or extension == 'x-msvideo' or \
                extension == 'x-ms-wmv' or extension == 'mpeg' or extension == 'x-flv' or \
                extension == 'mp3' or extension == 'midi' or extension == 'mpeg' or extension == 'm4a' or \
                extension == 'mov' or extension == 'MOV' or \
                extension == 'ogg' or extension == 'x-flac' or extension == 'x-wav' or extension == 'amr':
            return True
        return False
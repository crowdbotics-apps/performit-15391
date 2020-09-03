from logs.serializers import LogSerializer


class LogFunctions:
    @staticmethod
    def create_log(created_by, message):
        data = {"created_by": created_by, "message": message}
        log_data = LogSerializer(data=data)
        if log_data.is_valid():
            instance = log_data.save()
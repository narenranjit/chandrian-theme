class AppAssertionCredentials(AssertionCredentials):
    @util.positional(2)
    def __init__(self, scope, **kwargs):
        self.scope = util.scopes_to_string(scope)
        self.kwargs = kwargs
        super(AppAssertionCredentials, self).__init__(None)

    @classmethod
    def from_json(cls, json_data):
        data = json.loads(_from_bytes(json_data))
        return AppAssertionCredentials(data['scope'])

    def _refresh(self, http_request):
        query = '?scope=%s' % urllib.parse.quote(self.scope, '')
        uri = META.replace('{?scope}', query)
        response, content = http_request(uri)
        content = _from_bytes(content)
        if response.status == 200:
            try:
                d = json.loads(content)
            except Exception as e:
                raise HttpAccessTokenRefreshError(str(e),
                                                  status=response.status)
            self.access_token = d['accessToken']
        else:
            if response.status == 404:
                content += (' This can occur if a VM was created'
                            ' with no service account or scopes.')
            raise HttpAccessTokenRefreshError(content, status=response.status)

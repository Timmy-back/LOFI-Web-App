from locust import HttpUser, task, between


class LoginUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def login_with_wrong_password(self):
        with self.client.post(
            "/api/v1/auth/login",
            json={"email": "check3@example.com", "password": "wrongpass"},
            catch_response=True,
        ) as response:
            if response.status_code == 401:
                response.success()
                response.request_meta["name"] = "login (401 - rejected password)"
            elif response.status_code == 429:
                response.success()
                response.request_meta["name"] = "login (429 - rate limited)"
            else:
                response.failure(f"Unexpected status: {response.status_code}")

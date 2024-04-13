
# How to Use Node.js and Github Webhooks to Keep Remote Projects in Sync

## Introduction
When working on a project with multiple developers, it can be frustrating when one person pushes to a repository and then another begins making changes on an outdated version of the code. Mistakes like these cost time, which makes it worthwhile to set up a script to keep your repositories in sync. You can also apply this method in a production environment to push hotfixes and other changes quickly.

While other solutions exist to complete this specific task, writing your own script is a flexible option that leaves room for customization in the future.

GitHub lets you configure webhooks for your repositories, which are events that send HTTP requests when events happen. For example, you can use a webhook to notify you when someone creates a pull request or pushes new code.

In this guide you will develop a Node.js server that listens for a GitHub webhook notification whenever you or someone else pushes code to GitHub. This script will automatically update a repository on a remote server with the most recent version of the code, eliminating the need to log in to a server to pull new commits.



### Firewall

If you followed the initial server setup guide, you will need to allow this web server to communicate with the outside web by allowing traffic on port 8080

```bash
  sudo ufw allow 8080/tcp
```


## Testing the Webhook

We can test our webhook by using node to run it in the command line. Start the script and leave the process open in your terminal:

```bash
cd ~/NodeWebhooks
nodejs webhook.js
```
## Installing the Webhook as a Systemd Service

systemd is the task manager Ubuntu uses to control services. We will set up a service that will allow us to start our webhook script at boot and use systemd commands to manage it like we would with any other service.

`Start by creating a new service file:`
```
sudo nano /etc/systemd/system/webhook.service
```

Add the following configuration to the service file which tells systemd how to run the script. This tells Systemd where to find our node script and describes our service.

Make sure to replace sammy with your username.

```
[Unit]
Description=Github webhook
After=network.target

[Service]
Environment=NODE_PORT=8080
Type=simple
User=sammy
ExecStart=/usr/bin/nodejs /home/sammy/NodeWebhooks/webhook.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
Enable the new service so it starts when the system boots:
```
sudo systemctl enable webhook.service
```
Now start the service:
```
sudo systemctl start webhook
```
Ensure the service is started:
```
sudo systemctl status webhook
```

```
Output
● webhook.service - Github webhook
   Loaded: loaded (/etc/systemd/system/webhook.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2018-08-17 19:28:41 UTC; 6s ago
 Main PID: 9912 (nodejs)
    Tasks: 6
   Memory: 7.6M
      CPU: 95ms
   CGroup: /system.slice/webhook.service
           └─9912 /usr/bin/nodejs /home/sammy/NodeWebhooks/webhook.js
```
You are now able to push new commits to your repository and see the changes on your server.
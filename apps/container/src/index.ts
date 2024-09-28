import express from "express"

import Docker from 'dockerode';
import dotenv from "dotenv"

dotenv.config()


const app = express()
app.use(express.json())

const docker = new Docker({ socketPath: '/var/run/docker.sock' });



app.post('/api/v1/container', async (req, res) => {
    const {userId,projectId,imageName} = req.body
    try {
        const container = await docker.createContainer({
            Image:imageName,
            name: `user_${userId}_project_${projectId}_container`,
            Tty: true,
            HostConfig: {
                AutoRemove: true, // Automatically remove container on stop
                Memory: 512 * 1024 * 1024, // 512MB memory limit
                CpuShares: 512, // CPU limits
                Binds: [`/path/to/host/projects/${userId}/${projectId}:/workspace`] // Mount user's project directory
              },
              Env: [
                `USER_ID=${userId}`,
                `PROJECT_ID=${projectId}`
              ]
        })

        await container.start();
        res.json({
            success: true,
            containerId: container.id,
            userId,
            projectId
        })
        res.json({

        })
    } catch (error:any) {
        console.error(`Error creating container for user ${userId}, project ${projectId}:`, error);
        res.status(500).json({
          success: false,
          error: error.message
        });
    }
})


app.post('/api/v1/container/:containerId/stop', async (req, res) => {
    const {containerId} = req.body
    try {
        const container = docker.getContainer(containerId)
        await container.stop()


        res.json({
            success: true,
           message: `Container ${containerId} stopped successfully.`
        })
    } catch (error:any) {
        console.error(`Error stopping container ${containerId}:`, error);
        res.status(500).json({
          success: false,
          error: error.message
        });
    }

})

app.get('/container/status/:containerId', async (req, res) => {
    const { containerId } = req.params;
  
    try {
      const container = docker.getContainer(containerId);
      const data = await container.inspect();  // Inspect the container for status
  
      res.json({
        success: true,
        status: data.State.Status,  // Returns status like 'running', 'exited', etc.
        containerId
      });
    } catch (error:any) {
      console.error(`Error fetching status for container ${containerId}:`, error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  const port = process.env.PORT || 3008;
app.listen(port, () => {
  console.log(`🦈 Server running on port ${port}`);
});

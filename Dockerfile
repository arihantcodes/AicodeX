FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app


# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

CMD ["npm", "run", "dev"]

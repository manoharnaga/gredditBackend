# Use a Node.js base image
FROM node:latest

# Set environment variables
ENV PORT=7000
ENV MONGODB_URI="mongodb://mongodb:27017/backend"
ENV JWT_SECRET="dI3@shmanoharjidsfanagajsidfFD34#@#$SDfSDfj34%42"
ENV DEFAULT_PROFILE_PIC="https://firebasestorage.googleapis.com/v0/b/gred-772d3.appspot.com/o/profilealt.png?alt=media&token=e65e7cb9-6fdd-43c1-af24-caabb24439bd"

# Set the working directory in the container
WORKDIR /app

# Copy your application files to the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 7000

# Command to run your application
CMD ["node", "index.js"]
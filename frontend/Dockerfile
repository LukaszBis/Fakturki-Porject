
################################################################################
# Use node image for base image for all stages.
FROM node

# Set working directory for all build stages.
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install js-cookie

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

ENV REACT_APP_API_URL=https://localhost:7247

# Expose the port that the application listens on.
EXPOSE 5173

# Run the application.
CMD ["npm", "run", "dev"]

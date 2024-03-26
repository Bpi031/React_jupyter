# Dockerfile for Jupyter
# Use an official Anaconda runtime as a parent image
FROM continuumio/anaconda3

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . .

# Install R and the necessary packages
RUN apt-get update && \
    apt-get install -y r-base r-base-dev && \
    R -e "install.packages(c('IRkernel'), repos='http://cran.rstudio.com/')" && \
    R -e "IRkernel::installspec(user = FALSE)"

# Install Julia and IJulia
RUN apt-get update && \
    apt-get install -y julia && \
    julia -e 'using Pkg; Pkg.add("IJulia")'

# Make port 8888 available to the world outside this container
EXPOSE 8888

# Run Jupyter server when the container launches with the specified options
CMD ["jupyter", "notebook", "--ip='0.0.0.0'", "--no-browser", "--NotebookApp.token='123456'", "--allow-root"]
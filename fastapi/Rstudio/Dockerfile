# Start from a base image with Jupyter (Python) installed
FROM jupyter/base-notebook

USER root

# Install R
RUN apt-get update && \
    apt-get install -y r-base r-base-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER $NB_UID

# Install IRkernel
RUN R -e "install.packages(c('IRkernel', 'IRdisplay', 'repr', 'crayon', 'pbdZMQ', 'devtools', 'uuid', 'digest'), repos='http://cran.rstudio.com/')" && \
    R -e "IRkernel::installspec(user = FALSE)"

# Expose port for jupyter
EXPOSE 8889

# Start Jupyter notebook
CMD ["jupyter", "notebook", "--ip='*'", "--port=8889", "--no-browser", "--allow-root"]
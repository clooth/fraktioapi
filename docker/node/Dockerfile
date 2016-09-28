# Dockerfile extending the generic Node image with application files for a
# single application.
FROM gcr.io/google_appengine/nodejs
# Check to see if the the version included in the base runtime satisfies
# 6.6.0, if not then do an npm install of the latest available
# version that satisfies it.
RUN /usr/local/bin/install_node 6.6.0
COPY . /app/
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

CMD API_PORT=80 API_USERNAME=json-api API_PASSWORD=SgL7us5vQyisCXcEWYRjzi67Ul npm start
FROM scratch
COPY server /
COPY *.js /
COPY *.ico /
COPY *.svg /
CMD ["/server","-qh","http://178.62.59.88:31784"]

FROM scratch
COPY server /
COPY cmd/basic/ /
CMD ["/server","-qh","http://178.62.59.88:31784"]

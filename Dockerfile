FROM scratch
ADD server /
CMD ["/server","-serve","-qb","http://178.62.59.88:31784"]

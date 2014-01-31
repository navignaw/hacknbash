import pysftp

def main():
    srv = pysftp.Connection(host="unix.andrew.cmu.edu", username="estherw", password="Iknowyou'rereadingthis^2")

    #data = srv.listdir()
    
    #this will return an ls error if there are no directories in the folder
    data = srv.execute("ls -d */")

    data = map (lambda x: x.strip("/\n"), data)

    #hacky way of dealing with it
    if data[-1] == "ls: No match.":
        data = []
    print data


if __name__ == '__main__':
    main()

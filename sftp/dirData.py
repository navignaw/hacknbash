import pysftp
import json

#TODO: try catch for pysftp not installed
#for remove, return true or false for success/fail
class DirData:
    NYI = None    

    def __init__(self):
        self.user = ""
        self.pswd = ""
        self.srv = None

    def connect(self, user, pswd):
        self.pswd = pswd
        self.user = user
        try:
            self.srv = pysftp.Connection(host="unix.andrew.cmu.edu", username=self.user, password=self.pswd)
        except:
            return False
        return True

    def closeConnect(self):
        self.srv.close()
    
    #commands to execute on afs
    def cd(self, s):
        cmd = "cd " + s
        print "Executing " + cmd
        try:
            self.srv.chdir(cmd)
        except:
            return False
        return True

    def rm(self, s, isDir): 
        return NYI
        
    def cat(self, filename):
        return NYI

    def mkdir(self, dirname):
        return NYI

    def download(self, filename):
        return NYI


    #helper functions for returning directory contents
    def stripOutput(self, arr, toStrip):
        return map (lambda x: x.strip(toStrip), arr)

    def getDirs(self):
        try:
            data = self.srv.execute("ls -d */")
        except:
            return None

        data = self.stripOutput(data, "/\n")
    
        #hacky way of dealing with ls error
        if data[-1] == "ls: No match.":
            data = []
        return data

    def getFiles(self):
        try:
            #later: do this without two calls to ls
            all_files = self.srv.execute("ls")
            dirs = set(self.getDirs())
        except:
            return None
       
        all_files = set(self.stripOutput(all_files, "\n"))

        return list(all_files - dirs)
   
    def fileTypeParse(self, files):
        return NYI
 
    def makeJSON(self):
        files = self.getFiles()
        
        if files == None:
            return {"success": False}

        dirs = self.getDirs()
        if dirs == None:
            return {"success": False}
        
        data = {"success": True, "dirs": dirs, "files": files, }
        return data
       
    #call this to get the JSON 
    def getJSON(self):
        return self.makeJSON()
        
def main():

    d = DirData()
    d.connect("estherw", "Iknowyou'rereadingthis^2") 
    print d.getDirs()
    print d.getFiles()
    print d.getJSON()

if __name__ == '__main__':
    main()

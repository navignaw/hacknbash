import pysftp
import json

#TODO: try catch for pysftp not installed
#for remove, return true or false for success/fail
class DirData:
    NYI = None    

    def __init__(self):
        self.user = ""
        self.pswd = ""
        self.curDir = ""
        self.srv = None

    #helper functions for returning directory contents
    def __stripOutput__(self, arr, toStrip):
        return map (lambda x: x.strip(toStrip), arr)

    def __getDirs__(self):
        try:
            data = self.srv.execute("ls -d */")
        except:
            return None

        data = self.__stripOutput__(data, "/\n")
    
        #hacky way of dealing with ls error
        if data[-1] == "ls: No match.":
            data = []
        return data

    def __getFiles__(self):
        try:
            #later: do this without two calls to ls
            all_files = self.srv.execute("ls")
            dirs = set(self.__getDirs__())
        except:
            return None
       
        all_files = set(self.__stripOutput__(all_files, "\n"))

        return list(all_files - dirs)
   
    def __fileTypeParse__(self, files):
        return NYI
 
    def __makeJSON__(self):
        files = self.__getFiles__()
        
        if files == None:
            return {"success": False}

        dirs = self.__getDirs__()
        if dirs == None:
            return {"success": False}
        
        data = {"success": True, "dirs": dirs, "files": files, }
        return data
    
    def __exec__(self, cmd):
        try:
            self.srv.execute("cd " + self.curDir + " && " + cmd)
        except:
            return False
        return True
       
    def connect(self, user, pswd):
        self.pswd = pswd
        self.user = user
        try:
            self.srv = pysftp.Connection(host="unix.andrew.cmu.edu", 
                username=self.user, password=self.pswd)
        except:
            return False
        return True
        self.curDir = self.getcwd()

    def closeConnect(self):
        try:
            self.srv.close()
        except:
            return False
        return True
    
    #commands to execute on afs
    
    #requires that s is a directory with no / at the end
    def cd(self, s):
        self.srv.chdir(s)
        temp = self.srv.getcwd()
        self.srv.chdir(self.curDir)
        self.curDir = temp
        #try:
        #self.srv.chdir("private")
        #print self.srv.getcwd()
        #except:
        #    return False
        #return True

    def pwd(self):
        try:
            self.srv.execute("pwd")
        except:
            return False
        return True

    def rm(self, s, isDir): 
        cmd = ""
        if isDir:
            cmd = "rm -r " + s
        else:
            cmd = "rm " + s
        return self.__exec__(cmd)
        
    def cat(self, filename): 
        return self.__exec__("cat")

    def mkdir(self, dirname):
        return self.__exec__("mkdir " + dirname)

    def download(self, filename):
        try:
            self.srv.get(filename)
        except:
            return False
        return True

    #call this to get the JSON 
    def getJSON(self):
        return self.__makeJSON__()
        
def main():

    d = DirData()
    d.connect("estherw", "Iknowyou'rereadingthis^2") 
    print d.__getDirs__()
    d.cd("private")
    print d.__getFiles__()
    print d.download("15251.tar")
    #d.getJSON()

#if __name__ == '__main__':
#    main()

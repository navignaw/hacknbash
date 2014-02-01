import pysftp

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
            data = self.srv.execute("cd " + self.curDir + " && ls -d */")
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
            all_files = self.srv.execute("cd " + self.curDir + " && ls")
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
        self.curDir = self.getcwd().strip()

    def closeConnect(self):
        try:
            self.srv.close()
        except:
            return False
        return True
    
    #commands to execute on afs
    
    #requires that s is a directory with no / at the end
    def cd(self, s):
        print "changing directory"
        print self.curDir
        try:
            self.srv.chdir(s)
            temp = self.srv.getcwd().strip()
            self.srv.chdir(self.curDir)
            self.curDir = temp
            print self.curDir
        except:
            return False
        return True
        

    def pwd(self):
        wd = self.srv.execute("cd " + self.curDir + " && pwd")
        return wd[0].strip()

    def rm(self, s, isDir=False): 
        cmd = ""
        if isDir:
            cmd = "rm -r " + s
        else:
            cmd = "rm " + s
        return self.__exec__(cmd)
        
    def cat(self, filename): 
        try:
            text = self.srv.execute("cd " + self.curDir + " && " + cmd)
        except:
            return {"success": False}
        return {"success": False, "text": text}

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
    print d.mkdir("meow")
    #print d.rm("meow", True)
    print d.__getDirs__()
    #d.getJSON()

if __name__ == '__main__':
    main()

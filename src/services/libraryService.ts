interface LibraryService {
    hasLibrary() : Promise<boolean>
    getLink(title: string) : Promise<string>
    getLibraries() : Promise<LibraryDictionary>
    setLibrary(libraryKey: string) : Promise<void>
}

export interface LibraryInfo {
    name: string,
    url: string
}

export interface LibraryDictionary {
    [key: string]: LibraryInfo;
}

class LocalStorageLibraryService implements LibraryService {
    
    LIBRARY_KEY = "LOCAL_LIBRARY"
    LIBRARY_LINKS : LibraryDictionary  = {
        "CALGARY":  {    name: "Calgary Public Library",
                        url: "https://calgary.bibliocommons.com/v2/search?searchType=smart&query="
                    },
        "VANCOUVER":  {    name: "Vancouver Public Library",
                    url: "https://vpl.bibliocommons.com/v2/search?searchType=smart&query="
                    },
        "SEATTLE":  {    name: "Seattle Public Library",
                    url: "https://seattle.bibliocommons.com/v2/search?searchType=smart&query="
                    },
        "OKANAGAN":  {    name: "Okanagan Regional Library",
                    url: "https://orl.bibliocommons.com/v2/search?searchType=smart&query="
                    },
    }

    private getLibrary() : string {
        return localStorage.getItem(this.LIBRARY_KEY) || '';
    }

    async getLibraries(): Promise<LibraryDictionary> {
        return this.LIBRARY_LINKS
    }

    private libraryExists(libraryKey: string) {
        return libraryKey in this.LIBRARY_LINKS
    }

    async hasLibrary(): Promise<boolean> {
        return this.libraryExists(this.getLibrary())
    }

    async setLibrary(libraryKey: string): Promise<void> {
        if(libraryKey === "") {
            localStorage.removeItem(this.LIBRARY_KEY)
            return
        }
        else if(!(this.libraryExists(libraryKey)))
            throw new Error("Cannot match this library")

        localStorage.setItem(this.LIBRARY_KEY, libraryKey)
    }

    async getLink(title: string): Promise<string> {
        const library = this.getLibrary()
        if(library === "") {
            throw new Error("Library has not yet been selected")
        } else if ( !this.libraryExists(library)) {
            throw new Error("Unexpected library selected")
        }
        const libraryInfo : LibraryInfo = this.LIBRARY_LINKS[library]
        return libraryInfo.url + encodeURIComponent(title)
    }
}
export function getLibraryService() {
    return new LocalStorageLibraryService()
}

export type {
    LibraryService
}
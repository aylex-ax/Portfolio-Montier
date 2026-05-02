import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from "fs";
import path from "path";

const firebaseConfig = {
    apiKey: "AIzaSyDHtol8Ntvh3DI7kW168g1QhToQl0cRfD4",
    authDomain: "portfolio-montier.firebaseapp.com",
    projectId: "portfolio-montier",
    storageBucket: "portfolio-montier.appspot.com",
    messagingSenderId: "931252842453",
    appId: "1:931252842453:web:efbdfe36f99dd1383fd75c",
    measurementId: "G-D3C7DS9E63"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function uploadFile(localPath, folderName) {
    if (!localPath || localPath.startsWith("http")) return localPath;
    
    let relativePath = localPath.startsWith("/") ? localPath.slice(1) : localPath;
    let absolutePath = path.join(process.cwd(), "public", decodeURIComponent(relativePath));
    
    if (!fs.existsSync(absolutePath)) {
        // Fallback for space to dash
        absolutePath = path.join(process.cwd(), "public", relativePath.replace(/%20| /g, "-"));
        if (!fs.existsSync(absolutePath)) {
             console.error("File not found:", localPath);
             return localPath;
        }
    }
    
    const fileName = path.basename(absolutePath);
    const storageRef = ref(storage, `${folderName}/${fileName}`);
    const fileBuffer = fs.readFileSync(absolutePath);
    const uint8Array = new Uint8Array(fileBuffer);
    
    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.png')) contentType = 'image/png';
    else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (fileName.endsWith('.gif')) contentType = 'image/gif';
    else if (fileName.endsWith('.svg')) contentType = 'image/svg+xml';
    
    console.log(`Uploading ${fileName} to ${folderName}...`);
    await uploadBytes(storageRef, uint8Array, { contentType });
    
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`Uploaded ${fileName}. URL: ${downloadURL}`);
    return downloadURL;
}

async function migrate() {
    try {
        const siteContentPath = path.join(process.cwd(), "src", "data", "siteContent.json");
        const siteContent = JSON.parse(fs.readFileSync(siteContentPath, "utf-8"));
        
        siteContent.heroPortraitUrl = await uploadFile(siteContent.heroPortraitUrl, "hero");
        siteContent.heroBgUrl = await uploadFile(siteContent.heroBgUrl, "hero");
        
        siteContent.about.portraitUrl = await uploadFile(siteContent.about.portraitUrl, "about");
        siteContent.about.aboutBgImage = await uploadFile(siteContent.about.aboutBgImage, "about");
        
        for (let tool of siteContent.about.tools) {
            tool.icon = await uploadFile(tool.icon, "tools");
        }
        
        fs.writeFileSync(siteContentPath, JSON.stringify(siteContent, null, 2) + "\n");
        console.log("Updated siteContent.json");
        
        const projectsPath = path.join(process.cwd(), "src", "data", "projects.json");
        const projects = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));
        
        for (let proj of projects) {
            proj.thumbnailPath = await uploadFile(proj.thumbnailPath, "projects");
        }
        
        fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2) + "\n");
        console.log("Updated projects.json");
        
        console.log("Migration complete");
        process.exit(0);
    } catch (e) {
        console.error("Error during migration:", e);
        process.exit(1);
    }
}

migrate();

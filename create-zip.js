import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// Create a simple tar archive since zip might not be available
const createArchive = () => {
  const excludePatterns = [
    '--exclude=node_modules',
    '--exclude=dist',
    '--exclude=.git',
    '--exclude=*.log',
    '--exclude=.DS_Store',
    '--exclude=create-zip.js',
    '--exclude=3d-modeling-studio.tar.gz'
  ];
  
  const command = `tar ${excludePatterns.join(' ')} -czf 3d-modeling-studio.tar.gz .`;
  
  console.log('Creating project archive...');
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error creating archive:', error);
      return;
    }
    
    console.log('✅ Archive created successfully: 3d-modeling-studio.tar.gz');
    
    // Check file size
    const stats = fs.statSync('3d-modeling-studio.tar.gz');
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📦 Archive size: ${fileSizeInMB} MB`);
    
    // List what's included
    exec('tar -tzf 3d-modeling-studio.tar.gz | head -20', (err, out) => {
      if (!err) {
        console.log('\n📁 Files included (first 20):');
        console.log(out);
      }
    });
  });
};

createArchive();
export interface CloneOptions {
  url: string;
  outputDirectory?: string;
}

export interface CloneResult {
  success: boolean;
  localPath: string;
  url: string;
  totalFiles: number;
  totalSize: number;
}

export interface DeployResult {
  success: boolean;
  url: string;
  domain: string;
  error?: string;
}

export interface CloneAndDeployResult extends CloneResult {
  deployment?: DeployResult;
}
import {logger} from '../../utils/logger';
import {MarkdownFileDto} from './dto/MarkdownFileDto';
import FilePath from 'src/main/utils/FilePath';
import {BlogFileDto} from "./dto/BlogFileDto";
import {AccessTokenFileDto} from "./dto/AccessTokenFileDto";

const fs = require('fs-extra')
const path = require('path')

class FileService {

    /**
     *
     * @param {string} filePath
     * @returns {MarkdownFileDto}
     */
    async getMarkdown(filePath) {
        const markdownName = this._getMarkdownFileName(filePath);
        const content = await fs.readFile(filePath, 'utf8');
        return new MarkdownFileDto(filePath, markdownName, content);
    }

    /**
     *
     * @returns {Promise<BlogFileDto>}
     */
    async getBlog() {
        const jsonPath = `${FilePath.blogPath}`;
        const blog = await this._getJson(jsonPath);
        return new BlogFileDto(blog.blogName, blog.clientId, blog.secretKey);
    }

    /**
     *
     * @returns {Promise<AccessTokenFileDto>}
     */
    async getAccessToken() {
        const jsonPath = `${FilePath.tokenPath}`;
        const tokenJson = await this._getJson(jsonPath);
        return new AccessTokenFileDto(tokenJson.accessToken);
    }

    /**
     *
     * @returns {string}
     */
    _getDefaultMarkdownPath() {
        const dir = process.cwd();
        const filesInCurrentDirectory = fs.readdirSync(dir);
        const mdName = filesInCurrentDirectory.filter((file) => path.extname(file) === '.md');

        if(!mdName) {
            const message = "There are no Markdown files in the current directory.";
            logger.error(message);
            return '';
        }

        return dir+'/'+mdName;
    }

    /**
     *
     * @param {string} filePath
     * @returns {string}
     */
    _getMarkdownFileName (filePath) {
        const removedExt = filePath.slice(0, filePath.length-3); // .md 제거
        return path.parse(removedExt).name;
    }


    /**
     *
     * @param {string} jsonPath
     * @returns {Promise<any>}
     * @private
     */
    async _getJson(jsonPath) {
        try {
            const jsonData = await fs.readFile(jsonPath, 'utf8');
            return JSON.parse(jsonData);
        } catch (err) {
            logger.error(`There is no ${jsonPath}\n`);
            logger.error(`Please run markdown-tistory init`);
            logger.error(err);
            process.exit();
        }
    }
}

const fileService = new FileService();

export {fileService};
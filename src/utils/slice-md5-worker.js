import SparkMD5 from 'spark-md5';



self.onmessage = async e => {
	const { targetFile, baseChunkSize } = e.data;
	await sliceFile(targetFile, baseChunkSize);
};

/**
 * 文件分片 & Hash计算
*/
async function sliceFile(targetFile, baseChunkSize) {
	return new Promise((resolve, reject) => {
		const blobSlice = File.prototype.slice;// 初始化分片方法，兼容问题
		const chunkSize = baseChunkSize * 1024 * 1024;// 分片大小 baseChunkSize Mb
		const targetChunkCount = targetFile && Math.ceil(targetFile.size / chunkSize);// 分片数
		let currentChunkCount = 0;// 当前已执行分片数
		const spark = new SparkMD5.ArrayBuffer();// 创建sparkMD5对象
		const fileReader = new FileReader();// 创建文件读取对象
		let fileHash = null;// 文件hash
		const chunks = [];// 分片数组
		const workerMessage = { chunks, messageType: 'progress' };// 当前分块信息


		fileReader.onload = e => {
			
			const curChunk = e.target?.result;// 当前读取的分块结果 ArrayBuffer
			chunks.push(curChunk);
			// 将当前分块追加到spark对象中
			spark.append(curChunk);
			currentChunkCount++;

			// 满20个分片才发送一次，防止webworker和主线程通信过于频繁导致性能问题
			if (chunks.length >= 20) {
				workerMessage.chunks = chunks;
				workerMessage.messageType = 'progress';
				self.postMessage(workerMessage);
				// 清空数组以便下一次发送
				chunks.splice(0, chunks.length);
			}

			// 判断分块是否全部读取成功
			if (currentChunkCount >= targetChunkCount) {
				// 全部读取，获取文件hash
				fileHash = spark.end();
				// 如果剩余分片少于20个，也发送出去
				if (chunks.length > 0) {
					workerMessage.chunks = chunks;
				}
				workerMessage.fileHash = fileHash;
				workerMessage.messageType = 'success';
				self.postMessage(workerMessage);
				resolve();
			} else {
				loadNext();
			}
		};

		// FilerReader onerror事件
		fileReader.onerror = () => {
			workerMessage.messageType = 'fail';
			self.postMessage(workerMessage);
			reject();
		};

		// 读取下一个分块
		const loadNext = () => {
			// 计算分片的起始位置和终止位置
			const start = chunkSize * currentChunkCount;
			let end = start + chunkSize;
			if (end > targetFile.size) {
				end = targetFile.size;
			}
			// 读取文件，触发onLoad
			fileReader.readAsArrayBuffer(blobSlice.call(targetFile, start, end));
		};

		loadNext();
	});
}


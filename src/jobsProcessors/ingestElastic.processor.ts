export const processIngestElastic = async (job: any) => {
  console.log(`Processing ingestElastic job with ID: ${job.id}`);
  console.log(job.data);
};

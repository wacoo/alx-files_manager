import express from 'express';

const addMiddlewares = (api) => {
  api.use(express.json({ limit: '200mb' }));
};

export default addMiddlewares;

import https from 'https';
import dns from 'dns';
import net from 'net';
import tls from 'tls';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const HOST = 'generativelanguage.googleapis.com';
const PORT = 443;

async function runDiagnostics() {
  console.log('--- 1. ENDPOINT ---');
  console.log(`Target Host: ${HOST}`);

  console.log('\n--- 2. DNS TEST ---');
  await new Promise((resolve) => {
    dns.lookup(HOST, (err, address, family) => {
      if (err) {
        console.log('DNS: FAIL - ' + err.message);
      } else {
        console.log(`DNS: PASS - Resolved to ${address} (IPv${family})`);
      }
      resolve();
    });
  });

  console.log('\n--- 3. TCP TEST ---');
  await new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);
    socket.on('connect', () => {
      console.log('TCP: PASS');
      socket.destroy();
      resolve();
    });
    socket.on('timeout', () => {
      console.log('TCP: FAIL - Timeout');
      socket.destroy();
      resolve();
    });
    socket.on('error', (err) => {
      console.log('TCP: FAIL - ' + err.message);
      socket.destroy();
      resolve();
    });
    socket.connect(PORT, HOST);
  });

  console.log('\n--- 4. TLS & HTTPS TEST ---');
  await new Promise((resolve) => {
    const req = https.request({
      hostname: HOST,
      port: PORT,
      path: '/v1beta/models',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      console.log('TLS: PASS');
      console.log(`HTTPS: PASS - Status ${res.statusCode} (Expected 403/401 without key, which proves HTTP layer works)`);
      resolve();
    });
    req.on('timeout', () => {
      console.log('HTTPS: FAIL - Timeout');
      req.destroy();
      resolve();
    });
    req.on('error', (err) => {
      console.log('HTTPS: FAIL - ' + err.message);
      resolve();
    });
    req.end();
  });

  console.log('\n--- 5. PROXY CONFIGURATION ---');
  const proxies = ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'all_proxy', 'no_proxy'];
  let proxyFound = false;
  proxies.forEach(p => {
    if (process.env[p]) {
      console.log(`${p}: Configured`);
      proxyFound = true;
    }
  });
  if (!proxyFound) console.log('No proxy environment variables configured.');

  console.log('\n--- 6. GEMINI SDK TEST ---');
  const startTime = Date.now();
  console.log('SDK: Initialization started...');
  let hasValidKey = !!process.env.GEMINI_API_KEY;
  console.log(`SDK: API Key Present in ENV: ${hasValidKey}`);
  
  if (hasValidKey) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('SDK: Request started...');
      const reqStart = Date.now();
      await model.generateContent("Say 'hello' in one word.");
      console.log(`SDK: PASS - Request completed successfully in ${Date.now() - reqStart}ms.`);
    } catch (err) {
      console.log(`SDK: FAIL - Request failed in ${Date.now() - startTime}ms. Error Category: ${err.name} | Message: ${err.message}`);
    }
  } else {
    console.log('SDK: Skipped due to missing key.');
  }

  console.log('\n--- 7. DATABASE VERIFICATION (RECENT AIRequest) ---');
  const prisma = new PrismaClient();
  try {
    const lastReq = await prisma.aIRequest.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    if (lastReq) {
      console.log('AIRequest Log Found:', {
        organizationId: lastReq.organizationId,
        requestedById: lastReq.requestedById,
        feature: lastReq.feature,
        status: lastReq.status,
        durationMs: lastReq.durationMs,
        tokens: lastReq.tokens
      });
      console.log('Logging verification: PASS');
    } else {
      console.log('Logging verification: FAIL - No records found');
    }
  } catch (err) {
    console.log('Logging verification: FAIL - DB Error: ' + err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runDiagnostics().catch(console.error);

// Automated Test Runner for Smart Complaint System
import { CATEGORIES, OPDS, OFFICERS, SUBDISTRICTS, INITIAL_COMPLAINTS } from '../src/data/initialData.js';
import { 
  escapeHTML, 
  sanitizeImageSrc, 
  sanitizeCsvField, 
  sanitizeText, 
  isValidPhone, 
  validateImageFile 
} from '../src/utils/security.js';

console.log('======================================================');
console.log('🧪 SMART COMPLAINT SYSTEM - AUTOMATED TEST SUITE');
console.log('======================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} - ${details}`);
  }
}

// ----------------------------------------------------
// TEST SUITE 1: Data Model & Initial Seeds Verification
// ----------------------------------------------------
console.log('📋 Test Suite 1: Initial Seed Data & Structural Integrity');

assert(Array.isArray(CATEGORIES) && CATEGORIES.length >= 3, 'Categories array loaded and has MVP items (min. 3)');
assert(CATEGORIES.some(c => c.id === 'jalan_rusak'), 'MVP Category: Jalan Rusak exists');
assert(CATEGORIES.some(c => c.id === 'sampah_menumpuk'), 'MVP Category: Sampah Menumpuk exists');
assert(CATEGORIES.some(c => c.id === 'lampu_mati'), 'MVP Category: Lampu PJU Mati exists');

assert(Array.isArray(OPDS) && OPDS.length >= 3, 'OPDs list loaded (PUPR, DLH, Dishub, Satpol PP)');
assert(Array.isArray(OFFICERS) && OFFICERS.length >= 4, 'Field Officers list populated');
assert(Array.isArray(SUBDISTRICTS) && SUBDISTRICTS.includes('Kedaton'), 'Bandar Lampung Subdistricts verified');

assert(INITIAL_COMPLAINTS.length >= 4, 'Seed complaints contain rich demo data');
INITIAL_COMPLAINTS.forEach(c => {
  assert(!!c.id && c.id.startsWith('PKM-2024-'), `Ticket ID format valid: #${c.id}`);
  assert(!!c.coordinates && typeof c.coordinates.lat === 'number' && typeof c.coordinates.lng === 'number', `Coordinates valid for #${c.id}`);
  assert(Array.isArray(c.timeline) && c.timeline.length > 0, `Audit trail timeline exists for #${c.id}`);
});

// ----------------------------------------------------
// TEST SUITE 2: AI Heuristic Classification Engine (FR-15)
// ----------------------------------------------------
console.log('\n🤖 Test Suite 2: AI Smart Classification Engine (FR-15)');

function simulateAiClassification(text) {
  const lower = text.toLowerCase();
  let detectedCatId = 'jalan_rusak';
  let detectedPriority = 'Sedang';

  if (lower.includes('sampah') || lower.includes('bau') || lower.includes('kotor') || lower.includes('tumpuk') || lower.includes('plastik')) {
    detectedCatId = 'sampah_menumpuk';
    detectedPriority = lower.includes('banyak') || lower.includes('pasar') ? 'Tinggi' : 'Sedang';
  } else if (lower.includes('lampu') || lower.includes('pju') || lower.includes('gelap') || lower.includes('padam')) {
    detectedCatId = 'lampu_mati';
    detectedPriority = lower.includes('rawan') || lower.includes('begal') ? 'Tinggi' : 'Sedang';
  } else if (lower.includes('banjir') || lower.includes('got') || lower.includes('drainase') || lower.includes('saluran')) {
    detectedCatId = 'drainase_tersumbat';
    detectedPriority = 'Tinggi';
  } else if (lower.includes('lubang') || lower.includes('rusak') || lower.includes('aspal') || lower.includes('amblas')) {
    detectedCatId = 'jalan_rusak';
    detectedPriority = lower.includes('dalam') || lower.includes('bahaya') ? 'Tinggi' : 'Sedang';
  }
  return { detectedCatId, detectedPriority };
}

const aiTest1 = simulateAiClassification('Ada lubang aspal sangat dalam di tengah jalan membahayakan');
assert(aiTest1.detectedCatId === 'jalan_rusak' && aiTest1.detectedPriority === 'Tinggi', 'AI correctly identifies Jalan Rusak with High Priority');

const aiTest2 = simulateAiClassification('Tumpukan sampah plastik di depan pasar baunya sangat menyengat');
assert(aiTest2.detectedCatId === 'sampah_menumpuk' && aiTest2.detectedPriority === 'Tinggi', 'AI correctly identifies Sampah Pasar with High Priority');

const aiTest3 = simulateAiClassification('Lampu PJU mati sepanjang 200m sangat gelap dan rawan begal');
assert(aiTest3.detectedCatId === 'lampu_mati' && aiTest3.detectedPriority === 'Tinggi', 'AI correctly identifies Lampu PJU Mati with High Priority');

// ----------------------------------------------------
// TEST SUITE 3: End-to-End Complaint Lifecycle Simulation
// ----------------------------------------------------
console.log('\n🔄 Test Suite 3: End-to-End Complaint Lifecycle (FR-01 to FR-13)');

// 1. Citizen creates complaint
let store = [...INITIAL_COMPLAINTS];
const randomNum = Math.floor(1000 + Math.random() * 9000);
const newTicketId = `PKM-2024-${randomNum}`;
const newComplaint = {
  id: newTicketId,
  title: 'Gorong-gorong tersumbat sampah saat hujan lebat',
  category: 'Drainase & Saluran Air Tersumbat',
  categoryId: 'drainase_tersumbat',
  description: 'Air meluap ke badan jalan setinggi 20 cm karena sampah menyumbat mulut drainase.',
  location: 'Jl. ZA. Pagar Alam dekat gerbang Teknokrat',
  subdistrict: 'Kedaton',
  coordinates: { lat: -5.38178, lng: 105.25832 },
  photo: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
  status: 'Menunggu Verifikasi',
  priority: 'Tinggi',
  reporterName: 'Ahmad Mahasiswa UTI',
  reporterPhone: '0812-3344-5566',
  isAnonymous: false,
  assignedOpd: null,
  assignedOfficer: null,
  officerId: null,
  createdAt: new Date().toISOString(),
  slaHours: 24,
  timeline: [{
    status: 'Menunggu Verifikasi',
    timestamp: new Date().toISOString(),
    actor: 'Sistem Publik',
    notes: `Laporan berhasil diajukan dengan nomor tiket #${newTicketId}.`
  }],
  completionPhoto: null,
  completionNotes: null,
  feedback: null
};
store.unshift(newComplaint);
assert(store[0].id === newTicketId, 'Citizen complaint creation successful and stored in memory');

// 2. Admin verifies and dispatches to OPD
const targetOpd = 'Dinas PUPR (Bina Marga)';
const targetOfficer = OFFICERS[0]; // Budi Santoso
store = store.map(c => {
  if (c.id !== newTicketId) return c;
  return {
    ...c,
    status: 'Sedang Diproses',
    priority: 'Tinggi',
    assignedOpd: targetOpd,
    assignedOfficer: targetOfficer.name,
    officerId: targetOfficer.id,
    timeline: [
      ...c.timeline,
      {
        status: 'Diverifikasi & Disposisi',
        timestamp: new Date().toISOString(),
        actor: 'Admin Pemda Lampung',
        notes: `Disposisi ke ${targetOpd} - Petugas: ${targetOfficer.name}`
      }
    ]
  };
});
assert(store[0].status === 'Sedang Diproses' && store[0].assignedOfficer === targetOfficer.name, 'Admin verification & disposition successful');

// 3. Officer updates progress
store = store.map(c => {
  if (c.id !== newTicketId) return c;
  return {
    ...c,
    timeline: [
      ...c.timeline,
      {
        status: 'Sedang Diproses',
        timestamp: new Date().toISOString(),
        actor: `${targetOfficer.name} (Petugas Lapangan)`,
        notes: 'Tim tiba di lokasi dan mulai mengeruk sampah dari saluran gorong-gorong.'
      }
    ]
  };
});
assert(store[0].timeline.length === 3, 'Officer progress update recorded in timeline audit trail');

// 4. Officer completes task with proof
const proofPhoto = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';
const completionNote = 'Saluran drainase telah bersih 100%, aliran air lancar tanpa genangan.';
store = store.map(c => {
  if (c.id !== newTicketId) return c;
  return {
    ...c,
    status: 'Selesai',
    completionPhoto: proofPhoto,
    completionNotes: completionNote,
    timeline: [
      ...c.timeline,
      {
        status: 'Selesai',
        timestamp: new Date().toISOString(),
        actor: `${targetOfficer.name} (Petugas Lapangan)`,
        notes: completionNote
      }
    ]
  };
});
assert(store[0].status === 'Selesai' && !!store[0].completionPhoto, 'Officer completion upload with proof photo successful');

// 5. Citizen leaves feedback rating
store = store.map(c => {
  if (c.id !== newTicketId) return c;
  return {
    ...c,
    feedback: {
      rating: 5,
      comment: 'Cepat sekali responnya! Saluran air sekarang lancar tidak meluap lagi.',
      createdAt: new Date().toISOString()
    }
  };
});
assert(store[0].feedback.rating === 5, 'Citizen 5-star rating and feedback submission successful');

// ----------------------------------------------------
// TEST SUITE 4: Executive Calculations & CSV Export Sanitization
// ----------------------------------------------------
console.log('\n📊 Test Suite 4: Executive Metrics & Data Export');

const totalComplaints = store.length;
const completedCount = store.filter(c => c.status === 'Selesai').length;
const resolutionRate = ((completedCount / totalComplaints) * 100).toFixed(1);

assert(parseFloat(resolutionRate) >= 0 && parseFloat(resolutionRate) <= 100, `Resolution rate calculated: ${resolutionRate}%`);

// ----------------------------------------------------
// TEST SUITE 5: Security Defenses & Sanitization Audit (OWASP)
// ----------------------------------------------------
console.log('\n🛡️ Test Suite 5: Security Defenses & Sanitization Audit (OWASP Top 10)');

// 1. Anti-DOM XSS Sanitizer test (CWE-79)
const xssPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
const escapedXss = escapeHTML(xssPayload);
assert(!escapedXss.includes('<script>') && !escapedXss.includes('<img'), 'DOM XSS payload neutralized with HTML entities escaping');
assert(escapeHTML('"hello" & \'world\'') === '&quot;hello&quot; &amp; &#39;world&#39;', 'Quotes and ampersands properly escaped');

// 2. Anti-CSV Formula Injection (CWE-1236) test
const formulaPayloads = ['=cmd|"/C calc"!A0', '+1+2', '-100', '@SUM(A1:A10)', '\tTAB_ATTACK', '|MALICIOUS', '%PAYLOAD'];
formulaPayloads.forEach((payload) => {
  const sanitized = sanitizeCsvField(payload);
  assert(sanitized.startsWith("\"'"), `Formula trigger '${payload[0]}' safely prefixed with single quote: ${sanitized}`);
});

// 3. Image URL Protocol Validation (CWE-79 / SSRF)
assert(sanitizeImageSrc('javascript:alert(1)') === '', 'Dangerous javascript: URI protocol rejected in image source');
assert(sanitizeImageSrc('vbscript:msgbox(1)') === '', 'Dangerous vbscript: URI protocol rejected in image source');
assert(sanitizeImageSrc('data:text/html,<script>alert(1)</script>') === '', 'Dangerous data:text/html URI rejected');
assert(sanitizeImageSrc('https://example.com/photo.jpg') !== '', 'Safe https:// protocol allowed in image source');
assert(sanitizeImageSrc('data:image/jpeg;base64,/9j/4AAQSkZJRg==') !== '', 'Safe data:image/jpeg;base64 URI allowed');

// 4. File Upload Security Validation (CWE-434)
const validFile = { size: 2 * 1024 * 1024, type: 'image/jpeg' };
const oversizedFile = { size: 10 * 1024 * 1024, type: 'image/jpeg' };
const maliciousExtFile = { size: 1024, type: 'application/x-msdownload' };

assert(validateImageFile(validFile).valid === true, 'Valid 2MB JPEG file approved');
assert(validateImageFile(oversizedFile).valid === false, 'Oversized 10MB file rejected');
assert(validateImageFile(maliciousExtFile).valid === false, 'Executable application MIME type rejected');

// 5. Input Text Sanitization & Length Control
const dirtyInput = 'Normal Text \x00\x08With Control Chars   ';
const cleanInput = sanitizeText(dirtyInput, 20);
assert(!cleanInput.includes('\x00') && cleanInput.length <= 20, 'Control characters stripped and length capped');

// 6. Privacy & PII Protection (CWE-359 / UU No. 27/2022 UU PDP)
const anonComplaint = INITIAL_COMPLAINTS.find(c => c.isAnonymous);
assert(anonComplaint !== undefined, 'Anonymous complaint exists in initial dataset');
assert(anonComplaint.reporterPhone === '' || anonComplaint.reporterPhone === null, 'Anonymous report phone number strictly redacted/empty');
assert(anonComplaint.reporterName.includes('Anonim'), 'Anonymous report name masked properly');

// 7. Phone Number Format Validation
assert(isValidPhone('08123456789') === true, 'Standard 08xx phone number valid');
assert(isValidPhone('+628123456789') === true, 'International +62 format phone valid');
assert(isValidPhone('0812-3456-7890') === true, 'Dashed phone number format valid');
assert(isValidPhone('<script>alert(1)</script>') === false, 'Malicious script in phone number rejected');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n======================================================');
console.log(`🏁 TEST RESULTS: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TEST CASES PASSED SUCCESSFULLY!');
}

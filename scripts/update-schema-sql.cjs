const fs = require('fs');
const path = require('path');
const db = require('../data/db.json');

const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
let sql = fs.readFileSync(schemaPath, 'utf8');
const insertMarker = '-- Insert initial verified student SUFIYAN TATAGAR';
const markerIdx = sql.indexOf(insertMarker);
if (markerIdx >= 0) {
  sql = sql.substring(0, markerIdx);
}

const escapeSql = (s) => (s ? String(s).replace(/'/g, "''") : '');
const arrayToSql = (arr) => 'ARRAY[' + (arr || []).map(x => "'" + escapeSql(x) + "'").join(', ') + ']';

let inserts = '-- 5. Seed all 40 PES University student hacker profiles\n';
for (const u of db.users) {
  inserts += `INSERT INTO public.users (
  srn, prn, name, password_hash, salt, department, branch, semester, gender, campus, email, phone, hackathon_count, github_url, interests, skills, bio, looking_for_team, preferred_roles, created_at, updated_at
) VALUES (
  '${escapeSql(u.srn)}',
  '${escapeSql(u.prn)}',
  '${escapeSql(u.name)}',
  '${escapeSql(u.passwordHash)}',
  '${escapeSql(u.salt)}',
  '${escapeSql(u.department)}',
  '${escapeSql(u.branch)}',
  ${u.semester},
  '${escapeSql(u.gender || 'Male')}',
  '${escapeSql(u.campus || 'RR Campus')}',
  '${escapeSql(u.email || '')}',
  '${escapeSql(u.phone || '')}',
  ${u.hackathon_count || 0},
  '${escapeSql(u.github_url || '')}',
  ${arrayToSql(u.interests)},
  ${arrayToSql(u.skills)},
  '${escapeSql(u.bio || '')}',
  ${u.looking_for_team ?? true},
  ${arrayToSql(u.preferred_roles)},
  '${u.created_at}',
  '${u.updated_at}'
) ON CONFLICT (srn) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  hackathon_count = EXCLUDED.hackathon_count,
  skills = EXCLUDED.skills,
  interests = EXCLUDED.interests,
  bio = EXCLUDED.bio,
  looking_for_team = EXCLUDED.looking_for_team;\n\n`;
}

fs.writeFileSync(schemaPath, sql + inserts, 'utf8');
console.log('Successfully updated supabase/schema.sql with 40 profiles!');

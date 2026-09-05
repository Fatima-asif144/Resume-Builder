import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getDatabase, ref, set, get, } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCh5WVAxWrc05uKq7fmrX5DsNohoEn79X0",
    authDomain: "authentication-app-66307.firebaseapp.com",
    databaseURL: "https://authentication-app-66307-default-rtdb.firebaseio.com",
    projectId: "authentication-app-66307",
    storageBucket: "authentication-app-66307.firebasestorage.app",
    messagingSenderId: "32730136033",
    appId: "1:32730136033:web:424013494ddcb2b4cda6a0",
    measurementId: "G-SFZTQSR30G"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Global Counters
let expCount = 0;
let eduCount = 0;
let projCount = 0;

// Auth State Monitor & Load User Data
onAuthStateChanged(auth, async (user) => {
  const authSection = document.getElementById('auth-section');
  const appSection = document.getElementById('app-section');
  
  if (user) {
    if(authSection) authSection.classList.add('hidden');
    if(appSection) appSection.classList.remove('hidden');
    
    // Load saved data on login
    await loadUserData(user.uid);
  } else {
    if(authSection) authSection.classList.remove('hidden');
    if(appSection) appSection.classList.add('hidden');
  }
});

window.switchAuthTab = function(type) {
  const loginBtn = document.getElementById('tab-login-btn');
  const signupBtn = document.getElementById('tab-signup-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if(loginBtn) loginBtn.classList.toggle('active', type === 'login');
  if(signupBtn) signupBtn.classList.toggle('active', type === 'signup');
  if(loginForm) loginForm.classList.toggle('active', type === 'login');
  if(signupForm) signupForm.classList.toggle('active', type === 'signup');
};

// Authentication Handlers
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      swal('Welcome Back 💗','User LoggedIn Successfully✅','success')
    } catch (error) {
      swal({
        title: 'Opps! , Something Went wrong ❌' ,
        text: error.message,
        icon: 'error'
       })
      }
  });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      swal({
        title: 'Congratulations 🎉' ,
        text: 'SignUp Successfully!' ,
        icon: 'success'})
    } catch (error) {
      swal({
        title: 'Opps! , Something Went wrong ❌' ,
        text: error.message,
        icon: 'error'
       })
    }
  });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
      swal({
        title:'LogOut Successfully ✅',
        icon: 'info'
      });
      setTimeout(()=>{
    },2500);
    })
    console.log('Error:' , error.message);
  
}

// Dynamic Input Functions
window.addExperienceField = function(data = null) {
  expCount++;
  const container = document.getElementById('experience-list-inputs');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = 'dynamic-card';
  div.id = `exp-item-${expCount}`;
  div.innerHTML = `
    <button type="button" class="btn-remove" onclick="window.removeItem('exp-item-${expCount}')">X</button>
    <div class="form-grid">
      <div class="form-group"><label>Role / Job Title</label><input type="text" class="exp-title" placeholder="Software Engineer" value="${data?.title || ''}" /></div>
      <div class="form-group"><label>Company Name</label><input type="text" class="exp-company" placeholder="Google Inc." value="${data?.company || ''}" /></div>
      <div class="form-group"><label>Dates</label><input type="text" class="exp-dates" placeholder="2022 - Present" value="${data?.dates || ''}" /></div>
      <div class="form-group full-width"><label>Details</label><textarea class="exp-desc" rows="2" placeholder="Responsibilities...">${data?.desc || ''}</textarea></div>
    </div>
  `;
  container.appendChild(div);
  
  div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', window.updatePreview));
  window.updatePreview();
};

window.addEducationField = function(data = null) {
  eduCount++;
  const container = document.getElementById('education-list-inputs');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'dynamic-card';
  div.id = `edu-item-${eduCount}`;
  div.innerHTML = `
    <button type="button" class="btn-remove" onclick="window.removeItem('edu-item-${eduCount}')">X</button>
    <div class="form-grid">
      <div class="form-group"><label>Degree / Qualification</label><input type="text" class="edu-degree" placeholder="BS Computer Science" value="${data?.degree || ''}" /></div>
      <div class="form-group"><label>Institute</label><input type="text" class="edu-school" placeholder="University Name" value="${data?.school || ''}" /></div>
      <div class="form-group full-width"><label>Year</label><input type="text" class="edu-year" placeholder="2018 - 2022" value="${data?.year || ''}" /></div>
    </div>
  `;
  container.appendChild(div);

  div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', window.updatePreview));
  window.updatePreview();
};

window.addProjectField = function(data = null) {
  projCount++;
  const container = document.getElementById('project-list-inputs');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'dynamic-card';
  div.id = `proj-item-${projCount}`;
  div.innerHTML = `
    <button type="button" class="btn-remove" onclick="window.removeItem('proj-item-${projCount}')">X</button>
    <div class="form-grid">
      <div class="form-group"><label>Project Title</label><input type="text" class="proj-name" placeholder="E-Commerce App" value="${data?.name || ''}" /></div>
      <div class="form-group"><label>Link / Technologies</label><input type="text" class="proj-link" placeholder="React, Node.js" value="${data?.link || ''}" /></div>
      <div class="form-group full-width"><label>Description</label><textarea class="proj-desc" rows="2" placeholder="Built fullstack app...">${data?.desc || ''}</textarea></div>
    </div>
  `;
  container.appendChild(div);

  div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', window.updatePreview));
  window.updatePreview();
};

window.removeItem = function(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  window.updatePreview();
};

// Safe Text Extractor Helper
function getValue(id, fallback = '') {
  const el = document.getElementById(id);
  return el && el.value.trim() !== '' ? el.value : fallback;
}

// Error-Free Update Preview Function
window.updatePreview = function() {
  const nameEl = document.getElementById('pv-name');
  const titleEl = document.getElementById('pv-title');
  const emailEl = document.getElementById('pv-email');
  const phoneEl = document.getElementById('pv-phone');
  const locEl = document.getElementById('pv-location');
  const addrEl = document.getElementById('pv-address');
  const linkEl = document.getElementById('pv-link');
  const summaryEl = document.getElementById('pv-summary');

  if(nameEl) nameEl.innerText = getValue('res-name', 'John Doe');
  if(titleEl) titleEl.innerText = getValue('res-title', 'Senior Full Stack Engineer');
  if(emailEl) emailEl.innerText = getValue('res-email', 'john@example.com');
  if(phoneEl) phoneEl.innerText = getValue('res-phone', '+92 300 0000000');
  if(locEl) locEl.innerText = getValue('res-location', 'Karachi, Pakistan');
  if(addrEl) addrEl.innerText = getValue('res-address', 'Block 4, Gulshan');
  if(linkEl) linkEl.innerText = getValue('res-link', 'linkedin.com/in/username');
  if(summaryEl) summaryEl.innerText = getValue('res-summary', 'Results-driven engineer with expertise in software development.');

  // Photo
  const photoUrl = getValue('res-photo', '');
  const photoImg = document.getElementById('pv-photo');
  if (photoImg) {
    if (photoUrl) {
      photoImg.src = photoUrl;
      photoImg.classList.remove('hidden');
    } else {
      photoImg.classList.add('hidden');
    }
  }

  // Render Experiences
  const expContainer = document.getElementById('pv-exp-container');
  if (expContainer) {
    expContainer.innerHTML = '';
    document.querySelectorAll('#experience-list-inputs .dynamic-card').forEach(card => {
      const title = card.querySelector('.exp-title')?.value || '';
      const company = card.querySelector('.exp-company')?.value || '';
      const dates = card.querySelector('.exp-dates')?.value || '';
      const desc = card.querySelector('.exp-desc')?.value || '';

      if (title || company) {
        expContainer.innerHTML += `
          <div class="pv-block">
            <div class="pv-block-header"><strong>${title}${company ? ' - ' + company : ''}</strong> <span>${dates}</span></div>
            <div class="pv-block-desc">${desc}</div>
          </div>
        `;
      }
    });
  }

  // Render Education
  const eduContainer = document.getElementById('pv-edu-container');
  if (eduContainer) {
    eduContainer.innerHTML = '';
    document.querySelectorAll('#education-list-inputs .dynamic-card').forEach(card => {
      const degree = card.querySelector('.edu-degree')?.value || '';
      const school = card.querySelector('.edu-school')?.value || '';
      const year = card.querySelector('.edu-year')?.value || '';

      if (degree || school) {
        eduContainer.innerHTML += `
          <div class="pv-block">
            <div class="pv-block-header"><strong>${degree}</strong> <span>${year}</span></div>
            <div class="pv-block-desc">${school}</div>
          </div>
        `;
      }
    });
  }

  // Render Projects
  const projContainer = document.getElementById('pv-proj-container');
  if (projContainer) {
    projContainer.innerHTML = '';
    document.querySelectorAll('#project-list-inputs .dynamic-card').forEach(card => {
      const name = card.querySelector('.proj-name')?.value || '';
      const link = card.querySelector('.proj-link')?.value || '';
      const desc = card.querySelector('.proj-desc')?.value || '';

      if (name) {
        projContainer.innerHTML += `
          <div class="pv-block">
            <div class="pv-block-header"><strong>${name}</strong> <span>${link}</span></div>
            <div class="pv-block-desc">${desc}</div>
          </div>
        `;
      }
    });
  }

  // Render Skills
  const skillsInput = getValue('res-skills', '');
  const skillsContainer = document.getElementById('pv-skills');
  if (skillsContainer) {
    skillsContainer.innerHTML = '';
    const skillsArr = skillsInput ? skillsInput.split(',') : ['JavaScript', 'React', 'Node.js', 'Python'];
    skillsArr.forEach(skill => {
      if(skill.trim()) {
        skillsContainer.innerHTML += `<span class="skill-tag">${skill.trim()}</span>`;
      }
    });
  }
};

// Realtime Database Store Logic
window.saveToDatabase = async function() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save your data.");
    return;
  }

  // Array elements collection
  const experiences = [];
  document.querySelectorAll('#experience-list-inputs .dynamic-card').forEach(card => {
    experiences.push({
      title: card.querySelector('.exp-title')?.value || '',
      company: card.querySelector('.exp-company')?.value || '',
      dates: card.querySelector('.exp-dates')?.value || '',
      desc: card.querySelector('.exp-desc')?.value || ''
    });
  });

  const education = [];
  document.querySelectorAll('#education-list-inputs .dynamic-card').forEach(card => {
    education.push({
      degree: card.querySelector('.edu-degree')?.value || '',
      school: card.querySelector('.edu-school')?.value || '',
      year: card.querySelector('.edu-year')?.value || ''
    });
  });

  const projects = [];
  document.querySelectorAll('#project-list-inputs .dynamic-card').forEach(card => {
    projects.push({
      name: card.querySelector('.proj-name')?.value || '',
      link: card.querySelector('.proj-link')?.value || '',
      desc: card.querySelector('.proj-desc')?.value || ''
    });
  });

  const resumeData = {
    personalInfo: {
      name: getValue('res-name'),
      title: getValue('res-title'),
      email: getValue('res-email'),
      phone: getValue('res-phone'),
      location: getValue('res-location'),
      address: getValue('res-address'),
      link: getValue('res-link'),
      summary: getValue('res-summary'),
      photo: getValue('res-photo'),
      skills: getValue('res-skills')
    },
    experiences,
    education,
    projects,
    updatedAt: new Date().toISOString()
  };

  try {
    await set(ref(db, `users/${user.uid}`), resumeData);
    alert('Resume saved to Realtime Database successfully!');
  } catch (error) {
    alert('Error saving data: ' + error.message);
  }
};

// Fetch & Populate Saved Data Logic
async function loadUserData(userId) {
  try {
    const snapshot = await get(ref(db, `users/${userId}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // Populate fields
      if (data.personalInfo) {
        const info = data.personalInfo;
        if (document.getElementById('res-name')) document.getElementById('res-name').value = info.name || '';
        if (document.getElementById('res-title')) document.getElementById('res-title').value = info.title || '';
        if (document.getElementById('res-email')) document.getElementById('res-email').value = info.email || '';
        if (document.getElementById('res-phone')) document.getElementById('res-phone').value = info.phone || '';
        if (document.getElementById('res-location')) document.getElementById('res-location').value = info.location || '';
        if (document.getElementById('res-address')) document.getElementById('res-address').value = info.address || '';
        if (document.getElementById('res-link')) document.getElementById('res-link').value = info.link || '';
        if (document.getElementById('res-summary')) document.getElementById('res-summary').value = info.summary || '';
        if (document.getElementById('res-photo')) document.getElementById('res-photo').value = info.photo || '';
        if (document.getElementById('res-skills')) document.getElementById('res-skills').value = info.skills || '';
      }

      // Populate array items
      const expContainer = document.getElementById('experience-list-inputs');
      if (expContainer && data.experiences && data.experiences.length > 0) {
        expContainer.innerHTML = '';
        data.experiences.forEach(exp => window.addExperienceField(exp));
      }

      const eduContainer = document.getElementById('education-list-inputs');
      if (eduContainer && data.education && data.education.length > 0) {
        eduContainer.innerHTML = '';
        data.education.forEach(edu => window.addEducationField(edu));
      }

      const projContainer = document.getElementById('project-list-inputs');
      if (projContainer && data.projects && data.projects.length > 0) {
        projContainer.innerHTML = '';
        data.projects.forEach(proj => window.addProjectField(proj));
      }

      window.updatePreview();
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

window.setTheme = function(themeName) { 
  document.body.className = themeName; 
};

window.changeTemplate = function(templateClass) { 
  const preview = document.getElementById('resume-preview');
  if(preview) preview.className = `resume-paper ${templateClass}`; 
};

window.downloadPDF = function() {
  const element = document.getElementById('resume-preview');
  if (!element) return;
  
  html2pdf().set({
    margin: 0.2,
    filename: 'Resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(element).save();
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelectorAll('#experience-list-inputs .dynamic-card').length) window.addExperienceField();
  if (!document.querySelectorAll('#education-list-inputs .dynamic-card').length) window.addEducationField();
  if (!document.querySelectorAll('#project-list-inputs .dynamic-card').length) window.addProjectField();
  window.updatePreview();
});
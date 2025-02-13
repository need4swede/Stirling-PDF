/*<![CDATA[*/

document.addEventListener('DOMContentLoaded', function () {
  if (window.analyticsPromptBoolean) {
    const analyticsModal = new bootstrap.Modal(document.getElementById('analyticsModal'));
    analyticsModal.show();
  }
});
/*]]>*/
function setAnalytics(enabled) {
  fetchWithCsrf('api/v1/settings/update-enable-analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enabled),
  })
    .then((response) => {
      if (response.status === 200) {
        console.log('Analytics setting updated successfully');
        bootstrap.Modal.getInstance(document.getElementById('analyticsModal')).hide();
      } else if (response.status === 208) {
        console.log('Analytics setting has already been set. Please edit /config/settings.yml to change it.', response);
        alert('Analytics setting has already been set. Please edit /config/settings.yml to change it.');
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    })
    .catch((error) => {
      console.error('Error updating analytics setting:', error);
      alert('An error occurred while updating the analytics setting. Please try again.');
    });
}

updateFavoriteIcons();

const defaultView = localStorage.getItem('defaultView') || 'home'; // Default to "home"
if (defaultView === 'home-legacy') {
  window.location.href = '/home-legacy'; // Redirect to legacy view
}

function setAsDefault(value) {
  localStorage.setItem('defaultView', value);
  console.log(`Default view set to: ${value}`);
}

function adjustVisibleElements() {
  const container = document.querySelector('.recent-features');
  const subElements = Array.from(container.children);

  let totalWidth = 0;
  const containerWidth = container.offsetWidth;

  subElements.forEach((element) => {
    totalWidth += 12 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    if (totalWidth > window.innerWidth) {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }
  });
}

function adjustContainerAlignment() {
  document.querySelectorAll('.features-container').forEach((parent) => {
    parent.querySelectorAll('.feature-rows').forEach((container) => {
      const containerWidth = parent.offsetWidth;
      if (containerWidth < 32 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
        container.classList.add('single-column');
      } else {
        container.classList.remove('single-column');
      }
    });
  });
}
function toolsManager() {
  const convertToPDF = document.querySelector('#groupConvertTo');
  const convertFromPDF = document.querySelector('#groupConvertFrom');

  if (convertToPDF && convertFromPDF) {
    const itemsTo = Array.from(convertToPDF.querySelectorAll('.dropdown-item')).filter(
      (item) => !item.querySelector('hr.dropdown-divider')
    );
    const itemsFrom = Array.from(convertFromPDF.querySelectorAll('.dropdown-item')).filter(
      (item) => !item.querySelector('hr.dropdown-divider')
    );

    const totalItems = itemsTo.length + itemsFrom.length;

    if (totalItems > 12) {
      document.querySelectorAll('#convertGroup').forEach((element) => element.remove());
      document.querySelectorAll('#groupConvertTo').forEach((element) => (element.style.display = 'flex'));
      document.querySelectorAll('#groupConvertFrom').forEach((element) => (element.style.display = 'flex'));
    } else {
      document.querySelectorAll('#convertGroup').forEach((element) => (element.style.display = 'flex'));
      document.querySelectorAll('#groupConvertTo').forEach((element) => element.remove());
      document.querySelectorAll('#groupConvertFrom').forEach((element) => element.remove());
    }
  }
}
document.addEventListener('DOMContentLoaded', function () {
  toolsManager();
});

window.addEventListener('load', () => {
  adjustContainerAlignment();
  adjustVisibleElements();
});
window.addEventListener('resize', () => {
  adjustContainerAlignment();
  adjustVisibleElements();
});

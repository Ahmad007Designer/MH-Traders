// Global Variables
let cart = [];
let cartTotal = 0;
let selectedProduct = "tshirt";
let uploadedFiles = [];

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu");
  navMenu.classList.toggle("active");
}

// Cart Functions
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  cartSidebar.classList.toggle("active");
}

function addToCart(productName, price) {
  const existingItem = cart.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: price,
      quantity: 1,
      id: Date.now(),
    });
  }

  updateCartDisplay();
  showNotification(`${productName} added to cart!`, "success");
}

function updateCartDisplay() {
  const cartCount = document.querySelector(".cart-count");
  const cartItems = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  cartItems.innerHTML = "";
  cartTotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    cartTotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas fa-${getProductIcon(item.name)}"></i>
                    </div>
                    <div class="cart-item-info" style="flex: 1;">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${item.price} × ${
      item.quantity
    } = ₹${itemTotal}</div>
                    </div>
                    <button onclick="removeFromCart(${
                      item.id
                    })" style="background: none; border: none; color: var(--text-light); cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
    cartItems.appendChild(cartItem);
  });

  cartTotalElement.textContent = `₹${cartTotal}`;
}

function getProductIcon(productName) {
  const icons = {
    "Photo Printing": "camera",
    "T-Shirt Printing": "tshirt",
    "Mug Printing": "mug-hot",
    "Banner Printing": "flag",
    "Keychain Printing": "key",
    "Pillow Printing": "bed",
  };
  return icons[productName] || "gift";
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  updateCartDisplay();
  showNotification("Item removed from cart", "info");
}

// Customization Tool Functions
function selectProduct(product) {
  selectedProduct = product;
  document.querySelectorAll(".tool-option").forEach((option) => {
    option.classList.remove("active");
  });
  event.target.closest(".tool-option").classList.add("active");
}

function handleFileUpload(event) {
  uploadedFiles = Array.from(event.target.files);
  showNotification(
    `${uploadedFiles.length} file(s) uploaded successfully!`,
    "success"
  );
}

function previewDesign() {
  const customText = document.getElementById("customText").value;
  const textColor = document.getElementById("textColor").value;

  if (!customText && uploadedFiles.length === 0) {
    showNotification("Please add text or upload an image", "warning");
    return;
  }

  showNotification("Design preview generated! (Feature coming soon)", "info");
}

function addCustomToCart() {
  const customText = document.getElementById("customText").value;
  const productPrices = {
    tshirt: 299,
    mug: 199,
    pillow: 399,
    keychain: 99,
  };

  const productName = `Custom ${
    selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)
  }`;
  const price = productPrices[selectedProduct];

  addToCart(productName, price);
}

// Checkout and Payment Functions
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "warning");
    return;
  }

  // Simulate payment gateway integration
  const paymentMethods = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking",
    "Cash on Delivery",
  ];
  const selectedPayment = prompt(
    `Select payment method:\n${paymentMethods
      .map((method, index) => `${index + 1}. ${method}`)
      .join("\n")}`
  );

  if (selectedPayment && selectedPayment >= 1 && selectedPayment <= 5) {
    const orderNumber = "MHT" + Date.now();
    showNotification(
      `Order placed successfully! Order Number: ${orderNumber}`,
      "success"
    );
    cart = [];
    updateCartDisplay();
    toggleCart();
  }
}

// Contact Form Submission
function submitContactForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Simulate form submission
  showNotification(
    "Thank you for your message! We will get back to you soon.",
    "success"
  );
  event.target.reset();
}

// Order Tracking Functions
// function showOrderTracking() {
//   const modal = document.getElementById("orderModal");
//   modal.style.display = "flex";
// }

// function closeModal() {
//   const modal = document.getElementById("orderModal");
//   modal.style.display = "none";
// }

function trackOrder() {
  const orderNumber = document.getElementById("orderNumber").value;
  const trackingResult = document.getElementById("trackingResult");

  if (!orderNumber) {
    showNotification("Please enter an order number", "warning");
    return;
  }

  // Simulate order tracking
  const statuses = [
    "Order Placed",
    "In Production",
    "Quality Check",
    "Shipped",
    "Delivered",
  ];
  const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const statusIndex = statuses.indexOf(currentStatus);

  trackingResult.innerHTML = `
                <h4>Order Status: ${orderNumber}</h4>
                <div style="margin: 1rem 0;">
                    ${statuses
                      .map(
                        (status, index) => `
                        <div style="display: flex; align-items: center; margin: 0.5rem 0; ${
                          index <= statusIndex
                            ? "color: var(--primary-color); font-weight: bold;"
                            : "color: var(--text-light);"
                        }">
                            <i class="fas fa-${
                              index <= statusIndex ? "check-circle" : "circle"
                            }" style="margin-right: 0.5rem;"></i>
                            ${status}
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <p style="color: var(--text-light); font-size: 0.9rem;">
                    Estimated delivery: ${new Date(
                      Date.now() + 3 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                </p>
            `;
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const colors = {
    success: "#27ae60",
    warning: "#f39c12",
    info: "#3498db",
    error: "#e74c3c",
  };

  notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: var(--shadow);
                z-index: 4000;
                transition: all 0.3s ease;
                max-width: 300px;
            `;

  notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${
                      type === "success"
                        ? "check"
                        : type === "warning"
                        ? "exclamation"
                        : type === "error"
                        ? "times"
                        : "info"
                    }-circle"></i>
                    ${message}
                </div>
            `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 4000);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Close mobile menu if open
    const navMenu = document.querySelector(".nav-menu");
    navMenu.classList.remove("active");
  });
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
});

// Header Scroll Effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(10px)";
  } else {
    header.style.background = "var(--white)";
    header.style.backdropFilter = "none";
  }
});

// Additional Functions for Admin Panel Simulation
function showRefundPolicy() {
  alert(`Refund Policy:
1. Items can be returned within 7 days of delivery
2. Custom printed items are non-returnable unless defective
3. Refund processing takes 5-7 business days
4. Original packaging required for returns
5. Contact customer support for refund requests`);
}

// Initialize the website
document.addEventListener("DOMContentLoaded", () => {
  // Add welcome message
  setTimeout(() => {
    showNotification(
      "Welcome to MH Traders! Explore our custom printing services.",
      "info"
    );
  }, 2000);

  // Initialize cart from localStorage if available
  const savedCart = localStorage?.getItem("mhtraders_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
    } catch (e) {
      console.log("Error loading cart from storage");
    }
  }
});

// Save cart to localStorage when updated
function saveCart() {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("mhtraders_cart", JSON.stringify(cart));
  }
}

// Update the addToCart function to save cart
const originalAddToCart = addToCart;
addToCart = function (productName, price) {
  originalAddToCart(productName, price);
  saveCart();
};

// SEO and Performance Optimizations
// Lazy loading for images (when implemented)
// Service worker for offline functionality (future enhancement)
// Analytics tracking (to be implemented with actual analytics service)

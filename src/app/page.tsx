"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bike, Check, ChevronDown,
  Clock3, Command, CreditCard, LayoutDashboard, LogOut, MapPin, Menu, Package,
  Plus, Search, Settings, ShieldCheck, ShoppingBag, ShoppingCart, Store,
  TrendingUp, Users, X, Zap
} from "lucide-react";

type Role = "Customer" | "Store" | "Delivery" | "Admin";
type Product = { id: number; name: string; category: string; price: number; stock: number; emoji: string; store: string; description: string };
type Order = { id: string; customer: string; items: string; total: number; status: string; time: string; store: string; rider: string };
const initialProducts: Product[] = [
  { id: 1, name: "Farm-fresh tomatoes", category: "Vegetables", price: 38, stock: 24, emoji: "🍅", store: "Green Basket", description: "Fresh, locally sourced tomatoes" },
  { id: 2, name: "Organic bananas", category: "Fruits", price: 55, stock: 18, emoji: "🍌", store: "Green Basket", description: "Naturally ripened bananas" },
  { id: 3, name: "Whole milk", category: "Dairy", price: 32, stock: 30, emoji: "🥛", store: "Daily Dairy", description: "Fresh full-cream milk, 500 ml" },
  { id: 4, name: "Sourdough bread", category: "Bakery", price: 85, stock: 9, emoji: "🍞", store: "Daily Crust", description: "Small-batch artisan sourdough" },
  { id: 5, name: "Farm eggs (6)", category: "Dairy", price: 72, stock: 16, emoji: "🥚", store: "Daily Dairy", description: "Farm eggs, pack of six" },
  { id: 6, name: "Alphonso mangoes", category: "Fruits", price: 140, stock: 12, emoji: "🥭", store: "Green Basket", description: "Sweet seasonal mangoes" },
  { id: 7, name: "Potato chips", category: "Snacks", price: 25, stock: 40, emoji: "🥔", store: "Corner Mart", description: "Crispy salted potato chips" },
  { id: 8, name: "Ground coffee", category: "Beverages", price: 180, stock: 7, emoji: "☕", store: "Corner Mart", description: "Medium roast ground coffee" }
];
const initialOrders: Order[] = [
  { id: "LL-1048", customer: "Ananya Rao", items: "Tomatoes, Milk", total: 70, status: "Preparing", time: "10:24 AM", store: "Green Basket", rider: "Unassigned" },
  { id: "LL-1047", customer: "Rahul Nair", items: "Bread, Eggs", total: 157, status: "Out for delivery", time: "10:12 AM", store: "Daily Crust", rider: "Arjun K." },
  { id: "LL-1046", customer: "Priya Shah", items: "Mangoes, Bananas", total: 195, status: "Delivered", time: "9:48 AM", store: "Green Basket", rider: "Sana M." },
  { id: "LL-1045", customer: "Dev Menon", items: "Coffee, Chips", total: 205, status: "Pending", time: "9:35 AM", store: "Corner Mart", rider: "Unassigned" }
];
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const statusClass = (status: string) => status.toLowerCase().replaceAll(" ", "-");

export default function Home() {
  const [role, setRole] = useState<Role>("Admin");
  const [page, setPage] = useState("Overview");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("50");
  const [newCategory, setNewCategory] = useState("Vegetables");
  const [mobileNav, setMobileNav] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("localloop-demo-v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.orders) setOrders(parsed.orders);
      }
    } catch { /* Start with demo data if storage is unavailable. */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem("localloop-demo-v1", JSON.stringify({ products, orders }));
  }, [products, orders, hydrated]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const navItems = useMemo(() => {
    if (role === "Customer") return [{ name: "Discover", icon: ShoppingBag }, { name: "My cart", icon: ShoppingCart }, { name: "My orders", icon: Package }];
    if (role === "Store") return [{ name: "Overview", icon: LayoutDashboard }, { name: "Orders", icon: Package }, { name: "Inventory", icon: Store }];
    if (role === "Delivery") return [{ name: "Overview", icon: LayoutDashboard }, { name: "Deliveries", icon: Bike }, { name: "Earnings", icon: CreditCard }];
    return [{ name: "Overview", icon: LayoutDashboard }, { name: "Orders", icon: Package }, { name: "Stores", icon: Store }, { name: "Customers", icon: Users }, { name: "Analytics", icon: TrendingUp }, { name: "Settings", icon: Settings }];
  }, [role]);

  const filteredProducts = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.store.toLowerCase().includes(search.toLowerCase())) &&
    (category === "All" || p.category === category)
  );
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  function changeRole(next: Role) {
    setRole(next);
    setPage(next === "Customer" ? "Discover" : "Overview");
    setMobileNav(false);
  }
  function addToCart(product: Product) {
    if (product.stock <= 0) { setToast("This item is out of stock."); return; }
    setCart(old => ({ ...old, [product.id]: Math.min((old[product.id] || 0) + 1, product.stock) }));
    setToast(`${product.name} added to cart`);
  }
  function checkout() {
    if (!cartCount) return;
    const itemNames = products.filter(p => cart[p.id]).map(p => `${p.name} ×${cart[p.id]}`).join(", ");
    const order: Order = { id: `LL-${1050 + orders.length}`, customer: "Demo Customer", items: itemNames, total: cartTotal, status: "Pending", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), store: "Local stores", rider: "Unassigned" };
    setOrders(old => [order, ...old]);
    setProducts(old => old.map(p => ({ ...p, stock: Math.max(0, p.stock - (cart[p.id] || 0)) })));
    setCart({});
    setPage("My orders");
    setToast(`Order ${order.id} placed successfully`);
  }
  function advanceOrder(id: string) {
    const steps = ["Pending", "Preparing", "Ready for pickup", "Out for delivery", "Delivered"];
    setOrders(old => old.map(o => {
      if (o.id !== id) return o;
      const next = steps[Math.min(steps.indexOf(o.status) + 1, steps.length - 1)];
      return { ...o, status: next, rider: next === "Ready for pickup" ? "Arjun K." : o.rider };
    }));
    setToast("Order status updated");
  }
  function addProduct() {
    if (!newName.trim() || Number(newPrice) <= 0) { setToast("Enter a product name and a valid price."); return; }
    const emojiByCategory: Record<string, string> = { Vegetables: "🥬", Fruits: "🍎", Dairy: "🥛", Bakery: "🥖", Snacks: "🥨", Beverages: "🧃" };
    setProducts(old => [{ id: Math.max(0, ...old.map(p => p.id)) + 1, name: newName.trim(), category: newCategory, price: Number(newPrice), stock: 10, emoji: emojiByCategory[newCategory] || "📦", store: "Green Basket", description: "Newly added local product" }, ...old]);
    setNewName(""); setNewPrice("50"); setModal(false); setToast("Product added to inventory");
  }

  const title = role === "Customer" ? (page === "Discover" ? "Find your local favourites" : page) : page;
  const subtitle = role === "Customer" ? "Good things, from stores around your neighbourhood." : role === "Store" ? "Manage your store operations in one place." : role === "Delivery" ? "Your route, your deliveries, all in one place." : "Here’s what’s happening across your local network.";
  const showCatalog = role === "Customer" && page === "Discover";
  const showCart = role === "Customer" && page === "My cart";
  const showCustomerOrders = role === "Customer" && page === "My orders";
  const showInventory = (role === "Store" && page === "Inventory") || (role === "Admin" && page === "Stores");
  const showOrders = page === "Orders" || showCustomerOrders || page === "Deliveries";
  const showOverview = page === "Overview" || page === "Analytics" || page === "Earnings" || page === "Customers" || page === "Settings";

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Command size={21} strokeWidth={2.6}/></div><span>local<span className="brand-light">loop</span><small>DELIVERY NETWORK</small></span><button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="role-switcher"><div className="role-avatar">{role === "Customer" ? "C" : role === "Store" ? "S" : role === "Delivery" ? "D" : "A"}</div><div className="role-text"><strong>{role} workspace</strong><span>LocalLoop Demo</span></div><ChevronDown size={16} className="muted"/></div>
        <div className="nav-label">MENU</div>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.name} onClick={() => { setPage(item.name); setMobileNav(false); }} className={`nav-item ${page === item.name || (item.name === "Overview" && page === "Overview") ? "active" : ""}`}><Icon size={18}/><span>{item.name}</span>{item.name === "Orders" && pendingOrders > 0 && <b className="nav-count">{pendingOrders}</b>}</button>;
          })}
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Zap size={17}/></div><strong>Local delivery, reimagined.</strong><p>One connected network for every neighbourhood.</p><span className="online-dot"/> All systems operational</div><button className="nav-item logout" onClick={() => { setRole("Customer"); setPage("Discover"); setToast("Switched to customer demo"); }}><LogOut size={18}/><span>Switch to customer</span></button></div>
        <div className="sidebar-foot"><div className="avatar">HL</div><div><strong>Hitesh S. L.</strong><span>Demo account</span></div><button className="icon-button" aria-label="Account menu" onClick={() => setToast("Demo account — no sign-in required")}><ChevronDown size={16}/></button></div>
      </aside>

      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>}
      <section className="main-area">
        <header className="topbar"><div className="top-left"><button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div></div><div className="top-actions"><div className="live-pill"><span/> Live demo</div><button className="location-button" onClick={() => setToast("Demo location: Bengaluru, Karnataka")}><MapPin size={15}/> Bengaluru <ChevronDown size={14}/></button><div className="top-avatar">HL</div></div></header>

        <div className="content">
          <div className="page-heading"><div><div className="eyebrow">{role === "Customer" ? "YOUR NEIGHBOURHOOD" : role === "Admin" ? "OPERATIONS CENTRE" : `${role.toUpperCase()} PORTAL`}</div><h1>{title}</h1><p>{subtitle}</p></div><div className="heading-actions">{role === "Store" && <button className="primary-button" onClick={() => setModal(true)}><Plus size={17}/> Add product</button>}{role === "Customer" && <button className="primary-button" onClick={() => setPage("My cart")}><ShoppingCart size={17}/> Cart <span className="button-count">{cartCount}</span></button>}</div></div>

          {showCatalog && <>
            <div className="customer-hero"><div className="hero-copy"><span className="hero-tag"><Zap size={13}/> YOUR LOCAL LOOP</span><h2>Your neighbourhood.<br/>At your <em>doorstep.</em></h2><p>Everyday essentials from the stores you love, delivered locally.</p><div className="hero-meta"><span><Clock3 size={15}/> 20–35 min delivery</span><span><ShieldCheck size={15}/> Local & trusted</span></div></div><div className="hero-art"><div className="sun-disc"/><div className="hero-bag">🛍️</div><div className="float-item float-one">🥑</div><div className="float-item float-two">🥕</div><div className="float-item float-three">🍊</div><div className="hero-ground"/></div></div>
            <div className="catalog-toolbar"><div className="section-title"><h2>Popular near you</h2><span>{filteredProducts.length} items</span></div><div className="search-box"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or stores..."/>{search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={14}/></button>}</div></div>
            <div className="category-row">{["All", "Vegetables", "Fruits", "Dairy", "Bakery", "Snacks", "Beverages"].map(c => <button key={c} className={`category-chip ${category === c ? "selected" : ""}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
            <div className="product-grid">{filteredProducts.map(p => <article className="product-card" key={p.id}><div className={`product-art art-${p.id % 5}`}><span>{p.emoji}</span><small>{p.category}</small></div><div className="product-info"><div className="product-store"><Store size={12}/>{p.store}</div><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><div><strong>{money(p.price)}</strong><small>{p.stock} in stock</small></div><button className="add-button" disabled={p.stock <= 0} onClick={() => addToCart(p)} aria-label={`Add ${p.name} to cart`}>{cart[p.id] ? <span>{cart[p.id]} in cart</span> : <Plus size={18}/>}</button></div></div></article>)}</div>
            {filteredProducts.length === 0 && <div className="empty-state"><ShoppingBag size={30}/><h3>No products found</h3><p>Try another search or category.</p></div>}
          </>}

          {showCart && <div className="panel"><div className="panel-heading"><div><h2>Your cart</h2><p>Review your items before placing an order.</p></div><span className="count-pill">{cartCount} items</span></div>{cartCount === 0 ? <div className="empty-state"><ShoppingCart size={30}/><h3>Your cart is empty</h3><p>Discover products from local stores to get started.</p><button className="primary-button" onClick={() => setPage("Discover")}>Browse products <ArrowRight size={16}/></button></div> : <><div className="cart-list">{products.filter(p => cart[p.id]).map(p => <div className="cart-row" key={p.id}><div className="cart-emoji">{p.emoji}</div><div className="cart-product"><strong>{p.name}</strong><span>{p.store}</span></div><div className="quantity-control"><button onClick={() => setCart(old => ({ ...old, [p.id]: Math.max(0, (old[p.id] || 0) - 1) }))}>−</button><span>{cart[p.id]}</span><button disabled={cart[p.id] >= p.stock} onClick={() => addToCart(p)}>+</button></div><strong className="cart-line-total">{money(p.price * cart[p.id])}</strong></div>)}</div><div className="checkout-box"><div><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><div><span>Delivery fee</span><strong>{cartTotal >= 299 ? "FREE" : money(25)}</strong></div><div className="checkout-total"><span>Total</span><strong>{money(cartTotal + (cartTotal >= 299 ? 0 : 25))}</strong></div><button className="primary-button full-button" onClick={checkout}>Place demo order <ArrowRight size={17}/></button><p className="demo-note">Demo checkout only. No payment will be collected.</p></div></>}</div>}

          {showInventory && <div className="panel"><div className="panel-heading"><div><h2>{role === "Admin" ? "Store directory & catalogue" : "Inventory management"}</h2><p>Track stock levels and product availability.</p></div><button className="primary-button" onClick={() => setModal(true)}><Plus size={16}/> Add product</button></div><div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>STORE</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>AVAILABILITY</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><div className="table-product"><span>{p.emoji}</span><strong>{p.name}</strong></div></td><td>{p.store}</td><td>{p.category}</td><td className="money-cell">{money(p.price)}</td><td>{p.stock}</td><td><span className={`status-badge ${p.stock < 10 ? "status-pending" : "status-delivered"}`}>{p.stock < 10 ? "Low stock" : "In stock"}</span></td></tr>)}</tbody></table></div></div>}

          {showOrders && <div className="panel"><div className="panel-heading"><div><h2>{role === "Delivery" ? "Assigned deliveries" : showCustomerOrders ? "Your orders" : "Recent orders"}</h2><p>{role === "Delivery" ? "Move each delivery through its status." : "Track orders from placement to doorstep."}</p></div><div className="search-box compact"><Search size={15}/><input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} /></div></div><div className="table-wrap"><table><thead><tr><th>ORDER</th><th>{showCustomerOrders ? "ITEMS" : "CUSTOMER"}</th><th>STORE / ITEMS</th><th>TOTAL</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{orders.filter(o => [o.id,o.customer,o.items,o.status].join(" ").toLowerCase().includes(search.toLowerCase())).filter(o => role !== "Delivery" || o.status !== "Delivered").map(o => <tr key={o.id}><td><strong className="order-id">{o.id}</strong><small className="cell-sub">{o.time}</small></td><td>{showCustomerOrders ? o.items : o.customer}</td><td>{showCustomerOrders ? o.store : <><span>{o.store}</span><small className="cell-sub">{o.items}</small></>}</td><td className="money-cell">{money(o.total)}</td><td><span className={`status-badge status-${statusClass(o.status)}`}>{o.status}</span></td><td>{o.status !== "Delivered" && o.status !== "Cancelled" ? <button className="table-action" onClick={() => advanceOrder(o.id)}>{role === "Delivery" ? "Update" : "Advance"} <ArrowRight size={13}/></button> : <span className="done-label"><Check size={14}/> Complete</span>}</td></tr>)}</tbody></table></div>{orders.length === 0 && <div className="empty-state">No orders yet.</div>}</div>}

          {showOverview && <><div className="metrics-grid"><Metric title={role === "Delivery" ? "Assigned deliveries" : "Total orders"} value={role === "Delivery" ? String(orders.filter(o => o.status !== "Delivered").length) : String(orders.length)} delta="+12.8%" icon={<Package size={19}/>} tone="green" note="vs. previous period"/><Metric title={role === "Delivery" ? "Completed today" : "Gross order value"} value={role === "Delivery" ? String(deliveredOrders) : money(orders.reduce((s,o) => s + o.total, 0))} delta="+8.2%" icon={<CreditCard size={19}/>} tone="blue" note="demo data"/><Metric title={role === "Delivery" ? "Est. earnings" : "Active orders"} value={role === "Delivery" ? money(deliveredOrders * 35) : String(pendingOrders)} delta="+4.6%" icon={<Activity size={19}/>} tone="orange" note="currently in progress"/><Metric title={role === "Delivery" ? "Delivery rating" : "Active products"} value={role === "Delivery" ? "4.9/5" : String(products.length)} delta="Healthy" icon={<TrendingUp size={19}/>} tone="purple" note="across the network"/></div>
            <div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h2>{page === "Analytics" ? "Performance overview" : "Order activity"}</h2><p>Order volume across the last 7 days</p></div><button className="period-button">Last 7 days <ChevronDown size={14}/></button></div><div className="chart-legend"><span><i/> Orders</span><span><i className="legend-secondary"/> Deliveries</span></div><div className="bar-chart">{[{d:"Mon",a:42,b:27},{d:"Tue",a:61,b:38},{d:"Wed",a:48,b:34},{d:"Thu",a:77,b:48},{d:"Fri",a:57,b:40},{d:"Sat",a:91,b:67},{d:"Sun",a:69,b:51}].map(v=><div className="bar-group" key={v.d}><div className="bar-pair"><div className="bar bar-main" style={{height:`${v.a}%`}}/><div className="bar bar-secondary" style={{height:`${v.b}%`}}/></div><span>{v.d}</span></div>)}</div><div className="chart-footer"><span><ArrowUpRight size={15}/> <strong>18.6%</strong> <span>more orders this week</span></span><span className="chart-foot-muted">Illustrative demo analytics</span></div></div>
              <div className="panel activity-panel"><div className="panel-heading"><div><h2>Live activity</h2><p>Latest platform updates</p></div><span className="live-dot-label"><span/> Live</span></div><div className="activity-list">{orders.slice(0,4).map((o,i)=><div className="activity-item" key={o.id}><div className={`activity-icon activity-${i % 4}`}>{i === 0 ? <ShoppingBag size={16}/> : i === 1 ? <Bike size={16}/> : i === 2 ? <Check size={16}/> : <Store size={16}/>}</div><div className="activity-copy"><strong>{o.id} · {o.status}</strong><span>{o.customer} — {o.items}</span><small>{o.time}</small></div></div>)}</div><button className="text-link" onClick={() => setPage(role === "Delivery" ? "Deliveries" : "Orders")}>View all activity <ArrowRight size={15}/></button></div></div>
            <div className="panel bottom-table"><div className="panel-heading"><div><h2>Recent orders</h2><p>Most recent activity across the network</p></div><button className="text-link" onClick={() => setPage(role === "Delivery" ? "Deliveries" : "Orders")}>View all <ArrowRight size={15}/></button></div><div className="table-wrap"><table><thead><tr><th>ORDER ID</th><th>CUSTOMER</th><th>STORE</th><th>AMOUNT</th><th>STATUS</th><th>TIME</th></tr></thead><tbody>{orders.slice(0,4).map(o=><tr key={o.id}><td><strong className="order-id">{o.id}</strong></td><td>{o.customer}</td><td>{o.store}</td><td className="money-cell">{money(o.total)}</td><td><span className={`status-badge status-${statusClass(o.status)}`}>{o.status}</span></td><td>{o.time}</td></tr>)}</tbody></table></div></div>
          </>}

          {role === "Customer" && page === "Discover" && <div className="store-strip"><div><span className="store-strip-icon">🏪</span><div><strong>Stores around you</strong><span>Green Basket · Daily Dairy · Daily Crust · Corner Mart</span></div></div><span className="store-open"><i/> 4 stores open</span></div>}
          <footer className="footer"><span>© 2026 LocalLoop Technologies</span><span><span className="online-dot"/> All systems operational</span><span>Built for neighbourhood commerce</span></footer>
        </div>
      </section>

      {modal && <div className="modal-backdrop" onClick={() => setModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-heading"><div><h2>Add a product</h2><p>Add an item to the demo inventory.</p></div><button className="icon-button" onClick={() => setModal(false)} aria-label="Close modal"><X size={19}/></button></div><form onSubmit={e => { e.preventDefault(); addProduct(); }}><label>Product name<input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Fresh spinach" required autoFocus/></label><div className="form-row"><label>Price (₹)<input type="number" min="1" value={newPrice} onChange={e => setNewPrice(e.target.value)} required/></label><label>Category<select value={newCategory} onChange={e => setNewCategory(e.target.value)}>{["Vegetables","Fruits","Dairy","Bakery","Snacks","Beverages"].map(c=><option key={c}>{c}</option>)}</select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={16}/> Add product</button></div></form></div></div>}
      {toast && <div className="toast"><span className="toast-check"><Check size={15}/></span>{toast}<button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
      <div className="role-demo"><span>Preview as</span>{(["Admin","Customer","Store","Delivery"] as Role[]).map(r=><button key={r} className={role === r ? "role-active" : ""} onClick={() => changeRole(r)}>{r}</button>)}</div>
    </main>
  );
}

function Metric({ title, value, delta, icon, tone, note }: { title: string; value: string; delta: string; icon: React.ReactNode; tone: string; note: string }) {
  return <div className="metric-card"><div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><div className="metric-value">{value}</div><div className="metric-foot"><span className="metric-delta"><ArrowUpRight size={14}/>{delta}</span><span>{note}</span></div></div>;
}

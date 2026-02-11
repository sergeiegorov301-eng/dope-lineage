import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

// Register dagre layout
cytoscape.use(dagre);

/**
 * Dope Lineage - With Complex Lineage Support + Descendants + Blockchain Verification
 * Handles backcrosses, multi-generation hybrids, and children
 */

const GENETICS_DB = {
  nodes: [
    // --- CORE NODE ---
    { 
      id: "dd", 
      label: "Devil Driver", 
      type: "verified",
      breeder: "Tiki Madman",
      origin: "USA / Michigan",
      generation: 0,
      notes: "Selected for elite bag appeal, vigorous growth, and a unique terpene profile.",
      parents: ["sundae", "melon"],
      children: ["dantes_inferno"],
      // Blockchain verification data
      verification: {
        verified: true,
        verifiedBy: "Tiki Madman",
        verifiedDate: "January 15, 2024",
        txHash: "0x7a8f9c2b4e1d6f3a8c5b9e2f7d4a1c8e5b2f9a6d3c7e4b1f8a5c2e9d6b3f7a4c",
        sourceHash: "QmX4Ry7FvPQKN2bW8x9TmZ3hV6cL1dE2fG8jK4nM5pQ7rS9tU",
        blockchain: "Base"
      }
    },

    // --- DESCENDANTS (Children of Devil Driver) ---
    {
      id: "dantes_inferno",
      label: "Dante's Inferno",
      type: "documented",
      breeder: "Unknown",
      generation: 1, // First generation child (below DD)
      notes: "A potent cross combining the bag appeal of Devil Driver with the creamy cookie terps of Oreoz.",
      parents: ["oreoz", "dd"],
      children: ["rainbow_inferno"]
    },

    {
      id: "rainbow_inferno",
      label: "Rainbow Inferno",
      type: "documented",
      breeder: "Unknown",
      generation: 2, // Second generation child (below Dante's)
      notes: "Created through crossing Rainbow Sherbet #11 x Dante's Inferno strains.",
      parents: ["rainbow_sherbet_11", "dantes_inferno"]
    },

    {
      id: "oreoz",
      label: "Oreoz",
      type: "documented",
      breeder: "Unknown",
      generation: 0,
      notes: "Cookies and cream profile with dense, resinous flowers.",
      parents: ["cookies_n_cream", "secret_weapon"]
    },

    {
      id: "rainbow_sherbet_11",
      label: "Rainbow Sherbet #11",
      type: "documented",
      generation: 1,
      notes: "A fruity, dessert-forward phenotype."
    },

    {
      id: "cookies_n_cream",
      label: "Cookies N Cream",
      type: "documented",
      generation: -1, // Parent of Oreoz
      notes: "Starfighter x GSC cross known for its dessert-like aroma."
    },

    {
      id: "secret_weapon",
      label: "Secret Weapon",
      type: "undocumented",
      generation: -1, // Parent of Oreoz
      notes: "Proprietary genetics, exact lineage undisclosed."
    },

    // --- SUNDAE DRIVER LINE (Left Branch) ---
    { 
      id: "sundae", 
      label: "Sundae Driver", 
      type: "documented", 
      breeder: "Cannarado Genetics",
      origin: "Colorado",
      generation: -1, // Parent of DD
      notes: "A creamy, dessert-leaning cross that became a staple in modern breeding.",
      parents: ["fpog", "grape_pie"]
    },
    { 
      id: "fpog", 
      label: "FPOG", 
      type: "documented",
      generation: -2, // Grandparent of DD
      notes: "Fruity Pebbles OG. A complex multi-generation hybrid known for its tropical aroma.",
      lineageFormula: "(Green Ribbon × GDP) × Tahoe Alien",
      parents: ["green_ribbon", "gdp", "tahoe_alien"],
      parentRoles: { 
        "green_ribbon": "f1_component", 
        "gdp": "f1_component", 
        "tahoe_alien": "final_cross" 
      }
    },
    { 
      id: "green_ribbon", 
      label: "Green Ribbon", 
      type: "documented", 
      generation: -3, // Great-grandparent of DD
      notes: "Bay Area hybrid, brings potency and structure.",
      parents: ["trainwreck", "afghani"] 
    },
    { 
      id: "gdp", 
      label: "Granddaddy Purple", 
      type: "documented", 
      breeder: "Ken Estes",
      generation: -3, // Great-grandparent of DD
      notes: "The definitive purple indica from Northern California.",
      parents: ["mendo_purps", "skunk_afghani"] 
    },
    { 
      id: "tahoe_alien", 
      label: "Tahoe Alien", 
      type: "documented", 
      breeder: "Alien Genetics",
      generation: -3, // Great-grandparent of DD
      notes: "A potent cross of Tahoe OG and Alien Kush.",
      parents: ["tahoe_og", "alien_kush"] 
    },
    
    { 
      id: "grape_pie", 
      label: "Grape Pie", 
      type: "documented", 
      generation: -2, // Grandparent of DD
      notes: "Contributes deep grape flavor and resin density.",
      parents: ["cherry_pie", "grape_stomper"] 
    },
    { id: "cherry_pie", label: "Cherry Pie", type: "documented", generation: -3, parents: ["gdp", "durban_poison"] },
    { id: "grape_stomper", label: "Grape Stomper", type: "documented", generation: -3, parents: ["purple_elephant", "chemdog_sour_diesel"] },

    // --- MELONADE LINE (Right Branch) ---
    { 
      id: "melon", 
      label: "Melonade", 
      type: "documented", 
      breeder: "Midwest Best",
      origin: "California",
      generation: -1, // Parent of DD
      notes: "Award-winning strain known for intense citrus and melon terps.",
      parents: ["watermelon_zkitt", "lemon_tree"]
    },
    { 
      id: "watermelon_zkitt", 
      label: "Watermelon Zkittlez", 
      type: "documented", 
      generation: -2, // Grandparent of DD
      parents: ["watermelon_zum_zum", "og_eddy_lepp"] 
    },
    { 
      id: "lemon_tree", 
      label: "Lemon Tree", 
      type: "documented", 
      generation: -2, // Grandparent of DD
      notes: "A high-terpene Lemon Skunk x Sour Diesel cross.",
      parents: ["lemon_skunk", "sour_diesel"] 
    },

    // --- ANCESTRY & LANDRACES ---
    { 
      id: "trainwreck", 
      label: "Trainwreck", 
      type: "documented", 
      generation: -4,
      notes: "Classic Northern California mix of Mexican, Thai, and Afghani genetics.",
      parents: ["mexican", "thai", "afghani"] 
    },
    { id: "durban_poison", label: "Durban Poison", type: "verified", origin: "South Africa", generation: -4, notes: "Pure landrace sativa lineage." },
    { id: "tahoe_og", label: "Tahoe OG", type: "documented", generation: -4, parents: ["og_kush"] },
    { id: "sour_diesel", label: "Sour Diesel", type: "documented", generation: -3, parents: ["chemdog_91", "super_skunk"] },
    { id: "og_kush", label: "OG Kush", type: "documented", generation: -5, notes: "The genetic pillar of the modern cannabis era." },
    
    // LANDRACES
    { id: "mexican", label: "Mexican Landrace", type: "documented", origin: "Mexico", generation: -5 },
    { id: "thai", label: "Thai Landrace", type: "documented", origin: "Thailand", generation: -5 },
    { id: "afghani", label: "Afghani", type: "documented", origin: "Afghanistan", generation: -4 },
    
    // OTHER COMPONENTS
    { id: "mendo_purps", label: "Mendo Purps", type: "documented", generation: -4 },
    { id: "skunk_afghani", label: "Skunk #1 x Afghani", type: "undocumented", generation: -4 },
    { id: "alien_kush", label: "Alien Kush", type: "documented", generation: -4 },
    { id: "purple_elephant", label: "Purple Elephant", type: "documented", generation: -4 },
    { id: "chemdog_sour_diesel", label: "Chemdog x Sour Diesel", type: "documented", generation: -4 },
    { id: "watermelon_zum_zum", label: "Watermelon Zum Zum", type: "undocumented", generation: -3 },
    { id: "og_eddy_lepp", label: "OG Eddy Lepp", type: "documented", generation: -3 },
    { id: "lemon_skunk", label: "Lemon Skunk", type: "documented", generation: -3 },
    { id: "chemdog_91", label: "Chemdog 91", type: "documented", generation: -4 },
    { id: "super_skunk", label: "Super Skunk", type: "documented", generation: -4 }
  ]
};

const INITIAL_NODES = new Set(["dd", "melon", "sundae", "dantes_inferno"]);

export default function App() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [loadedNodes, setLoadedNodes] = useState(new Set(INITIAL_NODES));

  useEffect(() => {
    if (!cyRef.current || cyInstance.current) return;

    console.log("Initializing Cytoscape with Descendants...");

    const initialElements = [
      // Nodes
      { data: { id: "dd", label: "Devil Driver", type: "verified", breeder: "Tiki Madman", origin: "USA / Michigan", generation: 0, notes: "Elite bag appeal.", verification: GENETICS_DB.nodes[0].verification } },
      { data: { id: "melon", label: "Melonade", type: "documented", breeder: "Midwest Best", origin: "California", generation: -1 } },
      { data: { id: "sundae", label: "Sundae Driver", type: "documented", breeder: "Cannarado Genetics", origin: "Colorado", generation: -1 } },
      { data: { id: "dantes_inferno", label: "Dante's Inferno", type: "documented", generation: 1, notes: "Oreoz x Devil Driver cross" } },
      // Edges - Parents
      { data: { id: "e1", source: "melon", target: "dd" } },
      { data: { id: "e2", source: "sundae", target: "dd" } },
      // Edges - Children
      { data: { id: "e3", source: "dd", target: "dantes_inferno" } },
    ];

    const cy = cytoscape({
      container: cyRef.current,
      elements: initialElements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#10b981",
            label: "data(label)",
            color: "#ffffff",
            "text-valign": "bottom",
            "text-margin-y": window.innerWidth < 768 ? 14 : 12,
            "font-family": "system-ui, -apple-system, sans-serif",
            "font-size": window.innerWidth < 768 ? "14px" : "13px",
            "font-weight": "600",
            width: window.innerWidth < 768 ? 55 : 45,
            height: window.innerWidth < 768 ? 55 : 45,
            "text-outline-width": 3,
            "text-outline-color": "#18181b",
          },
        },
        {
          selector: 'node[type="verified"]',
          style: {
            "background-color": "#34d399",
            width: window.innerWidth < 768 ? 70 : 60,
            height: window.innerWidth < 768 ? 70 : 60,
            "border-width": window.innerWidth < 768 ? 6 : 5,
            "border-color": "#ffffff",
            "font-size": window.innerWidth < 768 ? "15px" : "14px",
          },
        },
        {
          selector: 'node[type="documented"]',
          style: {
            "background-color": "#10b981",
            opacity: 0.85,
            width: window.innerWidth < 768 ? 58 : 48,
            height: window.innerWidth < 768 ? 58 : 48,
          },
        },
        {
          selector: 'node[type="undocumented"]',
          style: {
            "background-color": "#71717a",
            opacity: 0.5,
            "border-width": 2,
            "border-style": "dashed",
            "border-color": "#a1a1aa",
            width: window.innerWidth < 768 ? 52 : 42,
            height: window.innerWidth < 768 ? 52 : 42,
          },
        },
        // DEFAULT EDGE STYLE
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#52525b",
            "target-arrow-color": "#52525b",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 1.3,
          },
        },
        // F1 COMPONENT EDGES (dashed, thin, grey)
        {
          selector: 'edge[role="f1_component"]',
          style: {
            "line-style": "dashed",
            "line-color": "#71717a",
            "target-arrow-color": "#71717a",
            opacity: 0.6,
            width: 2,
            "arrow-scale": 1.0,
          },
        },
        // FINAL CROSS EDGES (solid, thick, green)
        {
          selector: 'edge[role="final_cross"]',
          style: {
            "line-style": "solid",
            "line-color": "#10b981",
            "target-arrow-color": "#10b981",
            width: 4,
            "arrow-scale": 1.5,
          },
        },
      ],
      layout: getDagreLayout(),
      minZoom: 0.3,
      maxZoom: 3,
    });

    cyInstance.current = cy;
    console.log("Cytoscape initialized with", cy.nodes().length, "nodes");

    // Node click
    cy.on("tap", "node", (evt) => {
      const nodeData = evt.target.data();
      console.log("Node clicked:", nodeData.id);
      setSelectedStrain(nodeData);
      
      const nodeInfo = GENETICS_DB.nodes.find(n => n.id === nodeData.id);
      if (nodeInfo?.parents) {
        expandParents(cy, nodeData.id, nodeInfo);
      }
      if (nodeInfo?.children) {
        expandChildren(cy, nodeData.id, nodeInfo);
      }

      cy.animate({ 
        center: { eles: evt.target }, 
        zoom: 1.0, 
        duration: 500,
        easing: 'ease-in-out-cubic'
      });
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) setSelectedStrain(null);
    });

    // Hover effects
    cy.on("mouseover", "node", (evt) => {
      evt.target.style({ 
        "border-width": 4, 
        "border-color": "#fbbf24",
        "border-style": "solid"
      });
    });

    cy.on("mouseout", "node", (evt) => {
      const type = evt.target.data("type");
      if (type === "verified") {
        evt.target.style({ "border-width": 5, "border-color": "#ffffff" });
      } else if (type === "undocumented") {
        evt.target.style({ "border-width": 2, "border-style": "dashed", "border-color": "#a1a1aa" });
      } else {
        evt.target.style({ "border-width": 0 });
      }
    });

    return () => {
      console.log("Cleaning up Cytoscape");
      cy.destroy();
      cyInstance.current = null;
    };
  }, []);

  const getDagreLayout = () => {
    const isMobile = window.innerWidth < 768;
    return {
      name: "dagre",
      rankDir: "TB", // Top-to-Bottom: parents at top, children below
      nodeSep: isMobile ? 60 : 80,
      rankSep: isMobile ? 100 : 120,
      padding: isMobile ? 30 : 50,
      animate: true,
      animationDuration: 500,
      animationEasing: 'ease-out-cubic',
    };
  };

  const expandParents = (cy, nodeId, nodeInfo) => {
    const newNodes = new Set(loadedNodes);
    const elementsToAdd = [];

    if (!nodeInfo.parents) return;

    nodeInfo.parents.forEach(parentId => {
      if (!loadedNodes.has(parentId)) {
        const parentNode = GENETICS_DB.nodes.find(n => n.id === parentId);
        if (parentNode) {
          elementsToAdd.push({ 
            data: { 
              id: parentNode.id,
              label: parentNode.label,
              type: parentNode.type,
              breeder: parentNode.breeder,
              origin: parentNode.origin,
              generation: parentNode.generation,
              notes: parentNode.notes,
              lineageFormula: parentNode.lineageFormula
            },
            style: { opacity: 0 }
          });

          let edgeRole = "normal";
          if (nodeInfo.parentRoles) {
            edgeRole = nodeInfo.parentRoles[parentId] || "normal";
          }

          elementsToAdd.push({ 
            data: { 
              id: `${parentId}-${nodeId}`,
              source: parentId, 
              target: nodeId,
              role: edgeRole
            },
            style: { opacity: 0 }
          });
          newNodes.add(parentId);
        }
      }
    });

    if (elementsToAdd.length > 0) {
      console.log("Adding", elementsToAdd.length, "parent elements");
      addElementsAndLayout(cy, elementsToAdd, newNodes);
    }
  };

  const expandChildren = (cy, nodeId, nodeInfo) => {
    const newNodes = new Set(loadedNodes);
    const elementsToAdd = [];

    if (!nodeInfo.children) return;

    nodeInfo.children.forEach(childId => {
      if (!loadedNodes.has(childId)) {
        const childNode = GENETICS_DB.nodes.find(n => n.id === childId);
        if (childNode) {
          elementsToAdd.push({ 
            data: { 
              id: childNode.id,
              label: childNode.label,
              type: childNode.type,
              breeder: childNode.breeder,
              origin: childNode.origin,
              generation: childNode.generation,
              notes: childNode.notes
            },
            style: { opacity: 0 }
          });

          elementsToAdd.push({ 
            data: { 
              id: `${nodeId}-${childId}`,
              source: nodeId, 
              target: childId
            },
            style: { opacity: 0 }
          });
          newNodes.add(childId);
        }
      }
    });

    if (elementsToAdd.length > 0) {
      console.log("Adding", elementsToAdd.length, "child elements");
      addElementsAndLayout(cy, elementsToAdd, newNodes);
    }
  };

  const addElementsAndLayout = (cy, elementsToAdd, newNodes) => {
    cy.add(elementsToAdd);
    setLoadedNodes(newNodes);

    const layout = cy.layout(getDagreLayout());
    layout.run();
    
    setTimeout(() => {
      elementsToAdd.forEach(el => {
        const element = cy.getElementById(el.data.id || `${el.data.source}-${el.data.target}`);
        if (element) {
          const opacity = el.data.type === 'undocumented' ? 0.5 : 
                         el.data.type === 'documented' ? 0.85 : 
                         el.data.role === 'f1_component' ? 0.6 : 1;
          element.animate({
            style: { opacity: opacity },
            duration: 400
          });
        }
      });
    }, 600);
  };

  const resetView = () => {
    if (!cyInstance.current) return;
    
    const cy = cyInstance.current;
    
    const nodesToRemove = cy.nodes().filter(node => {
      return !INITIAL_NODES.has(node.id());
    });
    
    cy.remove(nodesToRemove);
    
    setLoadedNodes(new Set(INITIAL_NODES));
    setSelectedStrain(null);
    
    const layout = cy.layout(getDagreLayout());
    layout.run();
    
    setTimeout(() => {
      cy.fit(80);
    }, 600);
  };

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      margin: 0, 
      padding: 0,
      overflow: "hidden",
      backgroundColor: "#09090b",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
      touchAction: "none" // Prevent default touch behaviors
    }}>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        /* Improve touch scrolling on mobile */
        * {
          -webkit-overflow-scrolling: touch;
        }
        /* Prevent text selection on nodes */
        canvas {
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>
      {/* Header */}
      <div style={{
        padding: window.innerWidth < 768 ? "1rem 1rem" : "1.5rem 2rem",
        borderBottom: "1px solid #27272a",
        backgroundColor: "rgba(9, 9, 11, 0.95)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: window.innerWidth < 640 ? "column" : "row",
        gap: window.innerWidth < 640 ? "0.75rem" : "0",
        justifyContent: "space-between",
        alignItems: window.innerWidth < 640 ? "flex-start" : "center",
        position: "relative",
        zIndex: 40 // Higher than sidebar (30) so button is always visible
      }}>
        <h1 style={{
          fontSize: window.innerWidth < 640 ? "1.25rem" : "1.5rem",
          fontWeight: 900,
          textTransform: "uppercase",
          fontStyle: "italic",
          letterSpacing: "-0.05em"
        }}>
          DOPE <span style={{ color: "#34d399", textDecoration: "underline", textDecorationThickness: "4px", textUnderlineOffset: "8px" }}>LINEAGE</span>
        </h1>
        
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: "0.75rem", color: "#71717a", marginRight: "0.5rem" }}>
            {loadedNodes.size} strains
          </div>
          <button 
            onClick={resetView}
            style={{
              padding: window.innerWidth < 640 ? "0.625rem 1.25rem" : "0.5rem 1rem",
              backgroundColor: "#dc2626",
              border: "none",
              borderRadius: "0.5rem",
              color: "#ffffff",
              fontSize: window.innerWidth < 640 ? "0.8rem" : "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
              minHeight: "44px", // iOS touch target minimum
              minWidth: window.innerWidth < 640 ? "120px" : "auto"
            }}
            onMouseOver={e => e.target.style.backgroundColor = "#b91c1c"}
            onMouseOut={e => e.target.style.backgroundColor = "#dc2626"}
          >
            ↻ RESET
          </button>
        </div>
      </div>

      {/* Cytoscape Container */}
      <div 
        ref={cyRef} 
        style={{ 
          width: "100%",
          height: window.innerWidth < 640 ? "calc(100vh - 100px)" : "calc(100vh - 80px)",
          backgroundColor: "#09090b",
          position: "relative"
        }} 
      />

      {/* Sidebar */}
      {selectedStrain && (
        <div style={{
          position: "absolute",
          right: window.innerWidth < 768 ? 0 : 0,
          top: window.innerWidth < 768 ? (window.innerWidth < 640 ? "100px" : "80px") : 0, // Start below header on mobile
          left: window.innerWidth < 768 ? 0 : "auto",
          bottom: 0,
          height: window.innerWidth < 768 ? (window.innerWidth < 640 ? "calc(100% - 100px)" : "calc(100% - 80px)") : "100%",
          width: window.innerWidth < 768 ? "100%" : "380px",
          backgroundColor: "rgba(24, 24, 27, 0.98)",
          borderLeft: window.innerWidth < 768 ? "none" : "1px solid #27272a",
          borderTop: window.innerWidth < 768 ? "1px solid #27272a" : "none",
          padding: window.innerWidth < 768 ? "1.5rem" : "2rem",
          zIndex: 30,
          boxShadow: "-4px 0 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          overflowY: "auto",
          animation: window.innerWidth < 768 ? "slideUp 0.3s ease-out" : "slideInRight 0.3s ease-out"
        }}>
          <button 
            onClick={() => setSelectedStrain(null)}
            style={{
              background: "none",
              border: "none",
              color: "#71717a",
              cursor: "pointer",
              fontSize: window.innerWidth < 768 ? "1rem" : "0.875rem",
              marginBottom: "1.5rem",
              padding: window.innerWidth < 768 ? "0.75rem" : 0,
              fontWeight: 600,
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
            onMouseOver={e => e.target.style.color = "#ffffff"}
            onMouseOut={e => e.target.style.color = "#71717a"}
          >
            {window.innerWidth < 768 ? "← BACK" : "✕ CLOSE"}
          </button>
          
          <div style={{
            display: "inline-block",
            padding: "0.3rem 0.6rem",
            borderRadius: "0.3rem",
            fontSize: "0.625rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
            backgroundColor: selectedStrain.type === 'verified' ? '#34d399' : 
                           selectedStrain.type === 'documented' ? '#10b981' : '#71717a',
            color: '#09090b'
          }}>
            {selectedStrain.type}
          </div>

          <h2 style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#34d399",
            marginBottom: "0.5rem",
            lineHeight: 1.2
          }}>
            {selectedStrain.label}
          </h2>

          {/* BLOCKCHAIN VERIFICATION MOCKUP */}
          {selectedStrain.verification && (
            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1rem",
              backgroundColor: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              borderRadius: "0.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1rem" }}>✓</span>
                <p style={{ 
                  fontSize: "0.65rem", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.15em", 
                  color: "#34d399",
                  fontWeight: 700
                }}>
                  ON-CHAIN VERIFICATION
                </p>
              </div>
              
              <div style={{ fontSize: "0.75rem", lineHeight: 1.6, color: "#d4d4d8" }}>
                <p style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#71717a" }}>Verified by:</span> {selectedStrain.verification.verifiedBy}
                </p>
                <p style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#71717a" }}>Date:</span> {selectedStrain.verification.verifiedDate}
                </p>
                <p style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "#71717a" }}>Blockchain:</span> {selectedStrain.verification.blockchain}
                </p>
                <p style={{ 
                  fontSize: "0.65rem", 
                  color: "#10b981",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  marginTop: "0.75rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(52, 211, 153, 0.2)"
                }}>
                  Tx: {selectedStrain.verification.txHash.substring(0, 20)}...
                  <span style={{ 
                    marginLeft: "0.5rem",
                    color: "#34d399",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}>view</span>
                </p>
                <p style={{ 
                  fontSize: "0.65rem", 
                  color: "#10b981",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  marginTop: "0.5rem"
                }}>
                  Source: {selectedStrain.verification.sourceHash.substring(0, 20)}...
                  <span style={{ 
                    marginLeft: "0.5rem",
                    color: "#34d399",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}>IPFS</span>
                </p>
              </div>
            </div>
          )}

          {/* LINEAGE FORMULA */}
          {selectedStrain.lineageFormula && (
            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1rem",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "0.5rem"
            }}>
              <p style={{ 
                fontSize: "0.65rem", 
                textTransform: "uppercase", 
                letterSpacing: "0.15em", 
                color: "#10b981", 
                marginBottom: "0.5rem",
                fontWeight: 700
              }}>
                🧬 BREEDING FORMULA
              </p>
              <p style={{ 
                fontFamily: "monospace", 
                fontSize: "1rem", 
                color: "#34d399",
                fontWeight: 600,
                lineHeight: 1.6
              }}>
                {selectedStrain.lineageFormula}
              </p>
              <p style={{
                fontSize: "0.7rem",
                color: "#71717a",
                marginTop: "0.75rem",
                fontStyle: "italic"
              }}>
                Multi-generation hybrid cross
              </p>
            </div>
          )}
          
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#71717a", marginBottom: "0.3rem", fontWeight: 600 }}>
              Breeder
            </p>
            <p style={{ fontSize: "1.125rem", fontWeight: 500, color: "#e4e4e7" }}>
              {selectedStrain.breeder || "Unknown"}
            </p>
          </div>
          
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#71717a", marginBottom: "0.3rem", fontWeight: 600 }}>
              Origin
            </p>
            <p style={{ color: "#d4d4d8", fontSize: "0.95rem" }}>
              {selectedStrain.origin || "Not documented"}
            </p>
          </div>
          
          {selectedStrain.notes && (
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #27272a" }}>
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#71717a", marginBottom: "0.75rem", fontWeight: 600 }}>
                History & Insights
              </p>
              <p style={{ fontSize: "0.875rem", lineHeight: "1.65", color: "#d4d4d8", fontStyle: "italic" }}>
                {selectedStrain.notes}
              </p>
            </div>
          )}

          <div style={{ 
            marginTop: "2rem", 
            paddingTop: "1.5rem", 
            borderTop: "1px solid #27272a",
            fontSize: "0.75rem",
            color: "#71717a",
            lineHeight: 1.6
          }}>
            <p style={{ marginBottom: "0.5rem", fontWeight: 600, color: "#a1a1aa" }}>💡 Navigation</p>
            <p>Click parent strains to explore their lineage. Green thick lines show final crosses, dashed grey lines show F1 components.</p>
          </div>
        </div>
      )}

      {/* Legend */}
      {(!selectedStrain || window.innerWidth >= 768) && (
        <div style={{
          position: "absolute",
          bottom: window.innerWidth < 640 ? "1rem" : "2rem",
          left: window.innerWidth < 640 ? "1rem" : "2rem",
          right: window.innerWidth < 640 ? "1rem" : "auto",
          padding: window.innerWidth < 640 ? "0.75rem 1rem" : "1rem 1.25rem",
          backgroundColor: "rgba(24, 24, 27, 0.92)",
          border: "1px solid #27272a",
          borderRadius: "0.75rem",
          fontSize: window.innerWidth < 640 ? "0.65rem" : "0.7rem",
          color: "#a1a1aa",
          backdropFilter: "blur(8px)",
          zIndex: 10,
          maxWidth: window.innerWidth < 640 ? "none" : "auto"
        }}>
        <div style={{ fontWeight: 700, color: "#d4d4d8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.85rem", fontSize: "0.65rem" }}>
          Genetic Confidence
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "13px", height: "13px", backgroundColor: "#34d399", border: "2px solid white", borderRadius: "50%", flexShrink: 0 }} />
            <span>Verified (Signed Claim)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "13px", height: "13px", backgroundColor: "#10b981", borderRadius: "50%", opacity: 0.85, flexShrink: 0 }} />
            <span>Documented (Historical Evidence)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "13px", height: "13px", backgroundColor: "#71717a", borderRadius: "50%", opacity: 0.5, border: "1px dashed #a1a1aa", flexShrink: 0 }} />
            <span>Undocumented (Claimed)</span>
          </div>
        </div>

        {/* Edge types legend */}
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #3f3f46" }}>
          <div style={{ fontWeight: 700, color: "#d4d4d8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.85rem", fontSize: "0.65rem" }}>
            Lineage Connections
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "20px", height: "3px", backgroundColor: "#10b981", flexShrink: 0 }} />
              <span>Final Cross</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "20px", height: "2px", backgroundColor: "#71717a", opacity: 0.6, borderTop: "1px dashed #71717a", flexShrink: 0 }} />
              <span>F1 Component</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Helper Hint */}
      {loadedNodes.size <= 4 && !selectedStrain && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 5,
          padding: window.innerWidth < 640 ? "0 2rem" : "0"
        }}>
          <p style={{ 
            fontSize: window.innerWidth < 640 ? "0.85rem" : "0.95rem", 
            color: "#52525b", 
            marginBottom: "0.75rem", 
            fontWeight: 500 
          }}>
            {window.innerWidth < 640 ? "Tap a strain to explore" : "Click on a strain node to explore its genetic lineage"}
          </p>
          <p style={{ fontSize: window.innerWidth < 640 ? "1.5rem" : "1.75rem", color: "#3f3f46" }}>↓</p>
        </div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

// Register dagre layout
cytoscape.use(dagre);

/**
 * Dope Lineage - With Complex Lineage Support
 * Handles backcrosses and multi-generation hybrids
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
      parents: ["sundae", "melon"]
    },

    // --- SUNDAE DRIVER LINE (Left Branch) ---
    { 
      id: "sundae", 
      label: "Sundae Driver", 
      type: "documented", 
      breeder: "Cannarado Genetics",
      origin: "Colorado",
      generation: 1,
      notes: "A creamy, dessert-leaning cross that became a staple in modern breeding.",
      parents: ["fpog", "grape_pie"]
    },
    { 
      id: "fpog", 
      label: "FPOG", 
      type: "documented",
      generation: 2,
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
      generation: 3,
      notes: "Bay Area hybrid, brings potency and structure.",
      parents: ["trainwreck", "afghani"] 
    },
    { 
      id: "gdp", 
      label: "Granddaddy Purple", 
      type: "documented", 
      breeder: "Ken Estes",
      generation: 3,
      notes: "The definitive purple indica from Northern California.",
      parents: ["mendo_purps", "skunk_afghani"] 
    },
    { 
      id: "tahoe_alien", 
      label: "Tahoe Alien", 
      type: "documented", 
      breeder: "Alien Genetics",
      generation: 3,
      notes: "A potent cross of Tahoe OG and Alien Kush.",
      parents: ["tahoe_og", "alien_kush"] 
    },
    
    { 
      id: "grape_pie", 
      label: "Grape Pie", 
      type: "documented", 
      generation: 2,
      notes: "Contributes deep grape flavor and resin density.",
      parents: ["cherry_pie", "grape_stomper"] 
    },
    { id: "cherry_pie", label: "Cherry Pie", type: "documented", parents: ["gdp", "durban_poison"] },
    { id: "grape_stomper", label: "Grape Stomper", type: "documented", parents: ["purple_elephant", "chemdog_sour_diesel"] },

    // --- MELONADE LINE (Right Branch) ---
    { 
      id: "melon", 
      label: "Melonade", 
      type: "documented", 
      breeder: "Midwest Best",
      origin: "California",
      generation: 1,
      notes: "Award-winning strain known for intense citrus and melon terps.",
      parents: ["watermelon_zkitt", "lemon_tree"]
    },
    { 
      id: "watermelon_zkitt", 
      label: "Watermelon Zkittlez", 
      type: "documented", 
      generation: 2,
      parents: ["watermelon_zum_zum", "og_eddy_lepp"] 
    },
    { 
      id: "lemon_tree", 
      label: "Lemon Tree", 
      type: "documented", 
      generation: 2,
      notes: "A high-terpene Lemon Skunk x Sour Diesel cross.",
      parents: ["lemon_skunk", "sour_diesel"] 
    },

    // --- ANCESTRY & LANDRACES ---
    { 
      id: "trainwreck", 
      label: "Trainwreck", 
      type: "documented", 
      generation: 4,
      notes: "Classic Northern California mix of Mexican, Thai, and Afghani genetics.",
      parents: ["mexican", "thai", "afghani"] 
    },
    { id: "durban_poison", label: "Durban Poison", type: "verified", origin: "South Africa", notes: "Pure landrace sativa lineage." },
    { id: "tahoe_og", label: "Tahoe OG", type: "documented", parents: ["og_kush"] },
    { id: "sour_diesel", label: "Sour Diesel", type: "documented", parents: ["chemdog_91", "super_skunk"] },
    { id: "og_kush", label: "OG Kush", type: "documented", notes: "The genetic pillar of the modern cannabis era." },
    
    // LANDRACES
    { id: "mexican", label: "Mexican Landrace", type: "documented", origin: "Mexico" },
    { id: "thai", label: "Thai Landrace", type: "documented", origin: "Thailand" },
    { id: "afghani", label: "Afghani", type: "documented", origin: "Afghanistan" },
    
    // OTHER COMPONENTS
    { id: "mendo_purps", label: "Mendo Purps", type: "documented" },
    { id: "skunk_afghani", label: "Skunk #1 x Afghani", type: "undocumented" },
    { id: "alien_kush", label: "Alien Kush", type: "documented" },
    { id: "purple_elephant", label: "Purple Elephant", type: "documented" },
    { id: "chemdog_sour_diesel", label: "Chemdog x Sour Diesel", type: "documented" },
    { id: "watermelon_zum_zum", label: "Watermelon Zum Zum", type: "undocumented" },
    { id: "og_eddy_lepp", label: "OG Eddy Lepp", type: "documented" },
    { id: "lemon_skunk", label: "Lemon Skunk", type: "documented" }
  ]
};

const INITIAL_NODES = new Set(["dd", "melon", "sundae"]);

export default function App() {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [loadedNodes, setLoadedNodes] = useState(new Set(INITIAL_NODES));

  useEffect(() => {
    if (!cyRef.current || cyInstance.current) return;

    console.log("Initializing Cytoscape with Complex Lineage support...");

    const initialElements = [
      // Nodes
      { data: { id: "dd", label: "Devil Driver", type: "verified", breeder: "Tiki Madman", origin: "USA / Michigan", generation: 0, notes: "Elite bag appeal." } },
      { data: { id: "melon", label: "Melonade", type: "documented", breeder: "Midwest Best", origin: "California", generation: 1 } },
      { data: { id: "sundae", label: "Sundae Driver", type: "documented", breeder: "Cannarado Genetics", origin: "Colorado", generation: 1 } },
      // Edges
      { data: { id: "e1", source: "melon", target: "dd" } },
      { data: { id: "e2", source: "sundae", target: "dd" } },
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
            "text-margin-y": 12,
            "font-family": "system-ui, -apple-system, sans-serif",
            "font-size": "13px",
            "font-weight": "600",
            width: 45,
            height: 45,
            "text-outline-width": 3,
            "text-outline-color": "#18181b",
          },
        },
        {
          selector: 'node[type="verified"]',
          style: {
            "background-color": "#34d399",
            width: 60,
            height: 60,
            "border-width": 5,
            "border-color": "#ffffff",
            "font-size": "14px",
          },
        },
        {
          selector: 'node[type="documented"]',
          style: {
            "background-color": "#10b981",
            opacity: 0.85,
            width: 48,
            height: 48,
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
            width: 42,
            height: 42,
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

  // Dagre hierarchical layout
  const getDagreLayout = () => {
    return {
      name: "dagre",
      rankDir: "BT",
      nodeSep: 80,
      rankSep: 120,
      padding: 50,
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

          // Determine edge role for complex lineage
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
      console.log("Adding", elementsToAdd.length, "new elements");
      cy.add(elementsToAdd);
      setLoadedNodes(newNodes);

      // Run dagre layout
      const layout = cy.layout(getDagreLayout());
      layout.run();
      
      // Fade in new elements
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
    }
  };

  const resetView = () => {
    if (!cyInstance.current) return;
    
    const cy = cyInstance.current;
    
    // Remove all nodes except initial ones
    const nodesToRemove = cy.nodes().filter(node => {
      return !INITIAL_NODES.has(node.id());
    });
    
    cy.remove(nodesToRemove);
    
    // Reset state
    setLoadedNodes(new Set(INITIAL_NODES));
    setSelectedStrain(null);
    
    // Re-layout
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
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: "1.5rem 2rem",
        borderBottom: "1px solid #27272a",
        backgroundColor: "rgba(9, 9, 11, 0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: "1.5rem",
          fontWeight: 900,
          textTransform: "uppercase",
          fontStyle: "italic",
          letterSpacing: "-0.05em"
        }}>
          DOPE <span style={{ color: "#34d399", textDecoration: "underline", textDecorationThickness: "4px", textUnderlineOffset: "8px" }}>LINEAGE</span>
        </h1>
        
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "#71717a", marginRight: "0.5rem" }}>
            {loadedNodes.size} strains loaded
          </div>
          <button 
            onClick={resetView}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc2626",
              border: "none",
              borderRadius: "0.5rem",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "all 0.2s"
            }}
            onMouseOver={e => e.target.style.backgroundColor = "#b91c1c"}
            onMouseOut={e => e.target.style.backgroundColor = "#dc2626"}
          >
            ↻ RESET TO START
          </button>
        </div>
      </div>

      {/* Cytoscape Container */}
      <div 
        ref={cyRef} 
        style={{ 
          width: "100%",
          height: "calc(100vh - 80px)",
          backgroundColor: "#09090b",
          position: "relative"
        }} 
      />

      {/* Sidebar */}
      {selectedStrain && (
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "360px",
          backgroundColor: "rgba(24, 24, 27, 0.95)",
          borderLeft: "1px solid #27272a",
          padding: "2rem",
          zIndex: 20,
          boxShadow: "-4px 0 24px rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          overflowY: "auto"
        }}>
          <button 
            onClick={() => setSelectedStrain(null)}
            style={{
              background: "none",
              border: "none",
              color: "#71717a",
              cursor: "pointer",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              padding: 0,
              fontWeight: 600
            }}
            onMouseOver={e => e.target.style.color = "#ffffff"}
            onMouseOut={e => e.target.style.color = "#71717a"}
          >
            ✕ CLOSE
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

          {/* LINEAGE FORMULA - Show if complex cross */}
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
      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "2rem",
        padding: "1rem 1.25rem",
        backgroundColor: "rgba(24, 24, 27, 0.92)",
        border: "1px solid #27272a",
        borderRadius: "0.75rem",
        fontSize: "0.7rem",
        color: "#a1a1aa",
        backdropFilter: "blur(8px)",
        zIndex: 10
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

      {/* Helper Hint */}
      {loadedNodes.size <= 3 && !selectedStrain && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 5
        }}>
          <p style={{ fontSize: "0.95rem", color: "#52525b", marginBottom: "0.75rem", fontWeight: 500 }}>
            Click on a strain node to explore its genetic lineage
          </p>
          <p style={{ fontSize: "1.75rem", color: "#3f3f46" }}>↓</p>
        </div>
      )}
    </div>
  );
}
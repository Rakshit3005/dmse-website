# Lab IDs Reference

Quick reference for lab names and their corresponding IDs.

| Lab ID | Lab Name | Supervisor |
|--------|----------|------------|
| 1 | Polymer Characterization Lab - 2 | Gajraj Singh |
| 2 | Polymer Characterization Lab - 3 | Gajraj Singh |
| 3 | Polymer Chemistry / Synthesis Lab - 1 | Gajraj Singh |
| 4 | Polymer Processing Lab | Ehteshamul Islam |
| 5 | Advanced Processing Lab | Ehteshamul Islam |
| 6 | Polymer Engineering Lab - 1 | Ehteshamul Islam |
| 7 | Materials Characterization lab | Mohit Saini |
| 8 | Polymer Characterization lab - 1 | Ashish Sharma |
| 9 | B.Tech UG Lab | Amar Singh Yadav |
| 10 | GPF-4 | Amar Singh Yadav |
| 11 | Materials Testing Lab | Gajendra Kumar Yadav |
| 12 | Electronic and Computational Material Science Lab | Gajendra Kumar Yadav |
| 13 | Material testing lab | Brijesh Kumar |
| 14 | UG Material Science | S.B. Prasad |
| 15 | Material Characterization Lab | Jaswant Deepak Bara |
| 16 | Polymer Characterization lab - 2 | Jitendra Kumar |
| 17 | Microscopy lab | Jitendra Kumar |
| 18 | Confocal Raman Spectroscopy lab | Jitendra Kumar |
| 19 | AFM TR Lab | Jitendra Kumar |

## Quick Commands

To view this list anytime:
```bash
sqlite3 lab_system.db "SELECT id, name, supervisor FROM labs ORDER BY id;"
```

To view via API:
```bash
curl http://localhost:5000/api/equipment/labs
```


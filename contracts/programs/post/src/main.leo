// AnoneX Post Module
// Manages anonymous post publishing, editing, and deletion on Aleo
// All posts are linked to IPFS content hashes for decentralized storage

program anonex_post.aleo {
    // Post metadata stored on-chain
    struct PostMetadata {
        post_id: field,           // Unique post identifier
        author_hash: field,       // Hash of author's address (for anonymity)
        content_cid: field,       // IPFS CID hash of encrypted content
        timestamp: u64,           // Unix timestamp of creation
        edited: bool,             // Whether post has been edited
        is_active: bool           // Whether post is visible (not deleted)
    }

    // Private record for post ownership (only author can edit/delete)
    record PostOwnership {
        owner: address,
        post_id: field,
        content_cid: field,
        created_at: u64
    }

    // Public mapping of all posts
    mapping posts: field => PostMetadata;
    
    // Mapping to track total post count
    mapping post_counter: u8 => u64;

    // Generate a unique post ID from author and content
    inline generate_post_id(author: address, content_cid: field, nonce: field) -> field {
        let author_field: field = BHP256::hash_to_field(author);
        let combined: field = author_field + content_cid + nonce;
        return BHP256::hash_to_field(combined);
    }

    // Hash author address for anonymous on-chain storage
    inline hash_author(author: address) -> field {
        return BHP256::hash_to_field(author);
    }

    // Publish a new anonymous post
    // Returns a private ownership record to the author
    async transition publish_post(
        content_cid: field,
        timestamp: u64,
        nonce: field
    ) -> (PostOwnership, Future) {
        // Generate unique post ID
        let post_id: field = generate_post_id(self.caller, content_cid, nonce);
        
        // Create private ownership record
        let ownership: PostOwnership = PostOwnership {
            owner: self.caller,
            post_id: post_id,
            content_cid: content_cid,
            created_at: timestamp
        };

        // Hash author for public storage
        let author_hash: field = hash_author(self.caller);

        // Finalize on-chain
        let f: Future = finalize_publish_post(post_id, author_hash, content_cid, timestamp);
        
        return (ownership, f);
    }

    async function finalize_publish_post(
        post_id: field,
        author_hash: field,
        content_cid: field,
        timestamp: u64
    ) {
        // Create post metadata
        let metadata: PostMetadata = PostMetadata {
            post_id: post_id,
            author_hash: author_hash,
            content_cid: content_cid,
            timestamp: timestamp,
            edited: false,
            is_active: true
        };

        // Store post in mapping
        Mapping::set(posts, post_id, metadata);

        // Increment post counter
        let current_count: u64 = Mapping::get_or_use(post_counter, 0u8, 0u64);
        Mapping::set(post_counter, 0u8, current_count + 1u64);
    }

    // Edit an existing post (requires ownership record)
    async transition edit_post(
        ownership: PostOwnership,
        new_content_cid: field,
        timestamp: u64
    ) -> (PostOwnership, Future) {
        // Verify ownership by consuming the record
        assert_eq(ownership.owner, self.caller);

        // Create new ownership record with updated CID
        let new_ownership: PostOwnership = PostOwnership {
            owner: self.caller,
            post_id: ownership.post_id,
            content_cid: new_content_cid,
            created_at: ownership.created_at
        };

        // Finalize update on-chain
        let f: Future = finalize_edit_post(ownership.post_id, new_content_cid, timestamp);

        return (new_ownership, f);
    }

    async function finalize_edit_post(
        post_id: field,
        new_content_cid: field,
        timestamp: u64
    ) {
        // Get existing post
        let existing: PostMetadata = Mapping::get(posts, post_id);
        
        // Only update if post is active
        assert(existing.is_active);

        // Update post with new content
        let updated: PostMetadata = PostMetadata {
            post_id: existing.post_id,
            author_hash: existing.author_hash,
            content_cid: new_content_cid,
            timestamp: timestamp,
            edited: true,
            is_active: true
        };

        Mapping::set(posts, post_id, updated);
    }

    // Delete a post (soft delete - marks as inactive)
    async transition delete_post(
        ownership: PostOwnership
    ) -> Future {
        // Verify ownership
        assert_eq(ownership.owner, self.caller);

        // Finalize deletion on-chain
        return finalize_delete_post(ownership.post_id);
    }

    async function finalize_delete_post(post_id: field) {
        // Get existing post
        let existing: PostMetadata = Mapping::get(posts, post_id);
        
        // Mark as inactive (soft delete)
        let deleted: PostMetadata = PostMetadata {
            post_id: existing.post_id,
            author_hash: existing.author_hash,
            content_cid: existing.content_cid,
            timestamp: existing.timestamp,
            edited: existing.edited,
            is_active: false
        };

        Mapping::set(posts, post_id, deleted);

        // Decrement post counter
        let current_count: u64 = Mapping::get_or_use(post_counter, 0u8, 0u64);
        if current_count > 0u64 {
            Mapping::set(post_counter, 0u8, current_count - 1u64);
        }
    }
}
